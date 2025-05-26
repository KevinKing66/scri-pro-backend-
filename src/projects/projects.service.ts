/* eslint-disable prefer-const */
import {
  Injectable,
  BadRequestException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Document, FilterQuery, Model } from 'mongoose';
import { Project } from './entities/project.entity';
import { AwsService } from 'src/aws/aws.service';
import { CreateEvidenceDto } from 'src/evidences/dto/create-evidence.dto';
import { Evidence } from 'src/evidences/entities/evidence.entity';
import { FileInfo } from 'src/shared/entity/file.entity';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectModel('Project')
    private readonly projectModel: Model<Project>,
    private readonly awsService: AwsService,
  ) {}

  async create(dto: CreateProjectDto) {
    let thumbnail: FileInfo | null = null;

    try {
      if (dto.image) {
        thumbnail = await this.awsService.uploadBase64Image(
          dto.image.content,
          'thumbnail',
          '',
        );
      }

      const existingProject = await this.projectModel.findOne({
        code: dto.code,
      });

      if (existingProject) {
        throw new BadRequestException('El proyecto ya existe');
      }

      const project = new this.projectModel({
        ...dto,
        evidences: [],
        image: thumbnail,
      });

      const res = await project.save();

      if (!res) {
        throw new InternalServerErrorException('Error al guardar el proyecto');
      }

      await this.addEvidencesToProject(res._id as string, dto.evidences);

      return res;
    } catch (error) {
      // ✅ Si ya es una excepción de Nest, la relanzamos tal cual
      if (
        error instanceof BadRequestException ||
        error instanceof InternalServerErrorException ||
        error instanceof NotFoundException
      ) {
        throw error;
      }

      console.error(error);
      throw new InternalServerErrorException(
        'Error inesperado al crear el proyecto',
      );
    }
  }

  async addEvidencesToProject(_id: string, dto: CreateEvidenceDto[]) {
    const evidences = await Promise.all(
      dto
        .filter((e) => e.content && !e.key)
        .map(async (evidence) => {
          const fileInfo = await this.awsService.uploadBase64Image(
            evidence.content,
            'evidences',
            _id,
          );

          return {
            key: fileInfo.key,
            type: evidence.type,
            url: fileInfo.url,
            creationDateTime: new Date(),
            description: evidence.description,
            participants: evidence.participants,
          };
        }),
    );

    return this.projectModel.updateOne(
      { _id: _id },
      { $push: { evidences: { $each: evidences } } },
    );
  }

  async findAllByKeyword(page = 1, limit = 10, keyword?: string) {
    try {
      const skip = (page - 1) * limit;

      // Filtro de búsqueda si hay palabra clave
      const filter: FilterQuery<Project> = {};

      if (keyword) {
        const regex = new RegExp(keyword, 'i'); // i = ignore case
        filter.$or = [
          { name: regex },
          { code: regex },
          { description: regex },
          { 'members.name': regex },
          { 'members.email': regex },
          { 'owner.name': regex },
          { 'owner.email': regex },
          { 'researchGroups.name': regex },
          { 'researchGroups.code': regex },
        ];
      }

      const [data, total] = await Promise.all([
        this.projectModel
          .find(filter)
          .skip(skip)
          .limit(limit)
          .sort({ updatedAt: -1, createdAt: -1 })
          .lean(),
        this.projectModel.countDocuments(filter),
      ]);

      for (let project of data) {
        const key = project.image?.key;
        if (project.image && key) {
          project.image.url = await this.getUrlByKey(key);
        }
      }

      return {
        data,
        total,
        page,
        totalPages: Math.ceil(total / limit),
      };
    } catch (error: unknown) {
      console.error(error);
      throw new InternalServerErrorException('Error al obtener los proyectos');
    }
  }

  async findAll() {
    const projects = await this.projectModel.find();
    if (!projects) {
      throw new Error('Projects not found');
    }
    for (let project of projects) {
      const key = project.image?.key;
      if (project.image && key) {
        project.image.url = await this.getUrlByKey(key);
      }
    }
    return projects;
  }

  async findOne(_id: string) {
    const project = await this.projectModel.findOne({ _id: _id });
    if (!project) {
      throw new Error('Project not found');
    }

    if (project.image) {
      const key = project.image.key;
      project.image.url = await this.getUrlByKey(key);
    }

    for (let evidance of project.evidences) {
      evidance.url = await this.getUrl(evidance);
    }
    return project;
  }

  async getUrl(evidence: Evidence) {
    const key = evidence?.key ?? '';
    let url: string = '';
    if (evidence && evidence.type?.startsWith('image')) {
      url = await this.awsService.getFileUrl(key);
    } else {
      url = await this.awsService.getDownloadUrl(evidence.key);
    }
    return url;
  }

  async getUrlByKey(key: string) {
    return await this.awsService.getFileUrl(key);
  }

  async update(_id: string, updateProjectDto: UpdateProjectDto) {
    try {
      const project = await this.projectModel.findOne({ _id });

      if (!project) {
        throw new NotFoundException('Proyecto no encontrado');
      }

      await this.removeDeletedEvidencesFromProject(project, updateProjectDto);

      if (updateProjectDto.evidences) {
        await this.addEvidencesToProject(_id, updateProjectDto.evidences);
      }
      updateProjectDto.evidences = undefined;

      // Filtrar campos undefined del DTO
      let updateFields = Object.fromEntries(
        Object.entries(updateProjectDto).filter(
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          ([_, value]) => value !== undefined,
        ),
      );

      if (updateProjectDto.image?.content !== '' && project.image?.key) {
        await this.awsService.deleteFile(project.image?.key);
      }

      let thumbnail: FileInfo | null = null;
      if (
        updateProjectDto.image?.content &&
        updateProjectDto.image?.content.trim() !== '' &&
        (!updateProjectDto.image?.key ||
          updateProjectDto.image?.key.trim() === '')
      ) {
        thumbnail = await this.awsService.uploadBase64Image(
          updateProjectDto.image.content,
          'thumbnail',
          '',
        );
        updateFields.image = thumbnail;
      }

      updateFields.updatedAt = new Date();

      const res = await this.projectModel.updateOne(
        { _id: _id },
        { $set: updateFields },
      );

      // Verificar si el documento fue modificado
      if (res.modifiedCount === 0) {
        throw new BadRequestException(
          'No se realizaron cambios en el proyecto',
        );
      }

      return {
        message: 'Proyecto actualizado correctamente',
        modifiedCount: res.modifiedCount,
      };
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof InternalServerErrorException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }

      throw new InternalServerErrorException(
        'Error inesperado al actualizar el proyecto',
      );
    }
  }

  async removeDeletedEvidencesFromProject(
    project: Project,
    updateDto: UpdateProjectDto,
  ) {
    if (!updateDto.evidences || updateDto.evidences.length === 0) {
      return;
    }
    // Eliminar evidencias que no están en el DTO de actualización
    let evidencesToRemove = project.evidences
      ?.filter((p) => !updateDto.evidences?.some((e) => e.key === p.key))
      .map((e) => e.key);
    if (evidencesToRemove) {
      await this.awsService.deleteFiles(evidencesToRemove);
    }
  }

  async remove(code: string) {
    const project = await this.projectModel.findOne({ code });
    if (!project) {
      throw new Error('Project not found');
    }
    if (project.image) {
      await this.awsService.deleteFile(project.image.key);
    }
    await this.awsService.deleteFiles(project.evidences.map((e) => e.key));
    const res = await this.projectModel.deleteOne({ code });
    if (!res) {
      throw new Error('Project not found');
    }
    return res;
  }

  async removeEvidence(projectUuid: string, evidenceKey: string) {
    const res = await this.projectModel.updateOne(
      { uuid: projectUuid },
      { $pull: { evidences: { key: evidenceKey } } },
    );

    return res.modifiedCount > 0
      ? { message: 'Evidencia eliminada correctamente' }
      : { message: 'No se encontró la evidencia con la key proporcionada' };
  }
}
