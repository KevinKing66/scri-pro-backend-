import { Injectable } from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Project } from './entities/project.entity';
import { AwsService } from 'src/aws/aws.service';
import { CreateEvidenceDto } from 'src/evidences/dto/create-evidence.dto';
import { Evidence } from 'src/evidences/entities/evidence.entity';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectModel('Project')
    private readonly projectModel: Model<Project>,
    private readonly awsService: AwsService,
  ) {}

  async create(dto: CreateProjectDto) {
    const project = new this.projectModel({
      ...dto,
      evidences: [],
    });
    const existingProject = await this.projectModel.findOne({
      code: dto.code,
    });
    // Check if the project already exists
    if (existingProject) {
      throw new Error('Project already exists');
    }
    const res = await project.save();
    if (!res) {
      throw new Error('Project not found');
    }
    return await this.addEvidencesToProject(project.code, dto.evidences);
  }

  async addEvidencesToProject(project: string, dto: CreateEvidenceDto[]) {
    const evidences = await Promise.all(
      dto.map(async (evidence) => {
        const url = await this.awsService.uploadBase64Image(
          evidence.content,
          '',
          project,
        );

        return {
          key: evidence.key,
          type: evidence.type,
          url,
          creationDateTime: evidence.creationDateTime,
          description: evidence.description,
          participants: evidence.participants,
        };
      }),
    );

    return this.projectModel.updateOne(
      { uuid: project },
      { $push: { evidences: { $each: evidences } } },
    );
  }

  async findAll() {
    const projects = await this.projectModel.find();
    if (!projects) {
      throw new Error('Projects not found');
    }
    return projects;
  }

  async findOne(code: string) {
    const project = await this.projectModel.findOne({ code });
    if (!project) {
      throw new Error('Project not found');
    }

    for (const evidance of project.evidences) {
      evidance.url = await this.getUrl(evidance);
    }
    return project;
  }

  async getUrl(evidence: Evidence) {
    const key = evidence?.key ?? '';
    let url: string = '';
    if (evidence && evidence.type === 'image') {
      url = await this.awsService.getFileUrl(key);
    } else {
      url = await this.awsService.getDownloadUrl(evidence.key);
    }
    return url;
  }

  async update(code: string, updateProjectDto: UpdateProjectDto) {
    const project = await this.projectModel.findOne({ code });
    if (!project) {
      throw new Error('Project not found');
    }
    const updateFields = Object.fromEntries(
      Object.entries(updateProjectDto).filter(
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        ([_, value]) => value !== undefined,
      ),
    );
    const res = await this.projectModel.updateOne(
      { code },
      {
        $set: updateFields,
      },
    );
    if (!res) {
      throw new Error('Project not found');
    }
    return res;
  }

  async remove(code: string) {
    const project = await this.projectModel.findOne({ code });
    if (!project) {
      throw new Error('Project not found');
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



/*

import { Injectable } from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Project } from './entities/project.entity';
import { AwsService } from 'src/aws/aws.service';
import { CreateEvidenceDto } from 'src/evidences/dto/create-evidence.dto';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectModel('Project')
    private readonly projectModel: Model<Project>,
  ) { }

  async create(createProjectDto: CreateProjectDto) {
    const project = new this.projectModel(createProjectDto);
    const existingProject = await this.projectModel.findOne({
      code: createProjectDto.code,
    });
    // Check if the project already exists
    if (existingProject) {
      throw new Error('Project already exists');
    }
    const res = await project.save();
    if (!res) {
      throw new Error('Project not found');
    }
    return res;
  }

  async findAll() {
    const projects = await this.projectModel.find();
    if (!projects) {
      throw new Error('Projects not found');
    }
    return projects;
  }

  async findOne(code: string) {
    const project = await this.projectModel.findOne({ code });
    if (!project) {
      throw new Error('Project not found');
    }
    return project;
  }
  async update(code: string, updateProjectDto: UpdateProjectDto) {
    const project = await this.projectModel.findOne({ code });
    if (!project) {
      throw new Error('Project not found');
    }
    const updateFields = Object.fromEntries(
      Object.entries(updateProjectDto).filter(
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        ([_, value]) => value !== undefined,
      ),
    );
    const res = await this.projectModel.updateOne(
      { code },
      {
        $set: updateFields,
      },
    );
    if (!res) {
      throw new Error('Project not found');
    }
    return res;
  }

  async remove(code: string) {
    const project = await this.projectModel.findOne({ code });
    if (!project) {
      throw new Error('Project not found');
    }
    const res = await this.projectModel.deleteOne({ code });
    if (!res) {
      throw new Error('Project not found');
    }
    return res;
  }
}


*/