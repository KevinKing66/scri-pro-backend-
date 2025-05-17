import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateResearchGroupDto } from './dto/create-research-group.dto';
import { UpdateResearchGroupDto } from './dto/update-research-group.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ResearchGroup } from './entities/research-group.entity';

@Injectable()
export class ResearchGroupsService {
  constructor(
    @InjectModel('ResearchGroup')
    private readonly researchGroupModel: Model<ResearchGroup>,
  ) {}

  async create(createResearchGroupDto: CreateResearchGroupDto) {
    const researchGroup = new this.researchGroupModel(createResearchGroupDto);
    const existingResearchGroup = await this.researchGroupModel.findOne({
      code: createResearchGroupDto.code,
    });
    // Check if the researchGroup already exists
    if (existingResearchGroup) {
      throw new NotFoundException('ResearchGroup already exists');
    }
    const res = await researchGroup.save();
    if (!res) {
      throw new NotFoundException('ResearchGroup not found');
    }
    return res;
  }

  async findAllPaginated(page = 1, limit = 10, keyword?: string) {
    try {
      const skip = (page - 1) * limit;

      // Construcción del filtro de búsqueda
      const filter: Partial<Record<keyof ResearchGroup, any>> = {};

      if (keyword) {
        const regex = new RegExp(keyword, 'i');
        Object.assign(filter, {
          $or: [
            { code: regex },
            { name: regex },
            { description: regex },
            { admin: regex },
            { faculty: regex },
            { knowledgeArea: regex },
            { contactEmail: regex },
            { contactPhone: regex },
          ],
        });
      }

      const [data, total] = await Promise.all([
        this.researchGroupModel
          .find(filter)
          .skip(skip)
          .limit(limit)
          .sort({ updatedAt: -1, createdAt: -1 })
          .lean(),
        this.researchGroupModel.countDocuments(filter),
      ]);

      return {
        data,
        total,
        page,
        totalPages: Math.ceil(total / limit),
      };
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(
        'Error al obtener los grupos de investigación',
      );
    }
  }

  async findAll(): Promise<ResearchGroup[]> {
    const researchGroups = await this.researchGroupModel.find();
    if (!researchGroups) {
      throw new NotFoundException('ResearchGroups not found');
    }
    return researchGroups;
  }

  async findOne(code: string): Promise<ResearchGroup> {
    const researchGroup = await this.researchGroupModel.findOne({ code: code });
    if (!researchGroup) {
      throw new NotFoundException('ResearchGroup not found');
    }
    return researchGroup;
  }

  async update(code: string, updateResearchGroupDto: UpdateResearchGroupDto) {
    const researchGroup = await this.researchGroupModel.findOne({ code: code });
    if (!researchGroup) {
      throw new NotFoundException('ResearchGroup not found');
    }
    const res = await this.researchGroupModel.updateOne(
      { code: code },
      {
        $set: {
          code: updateResearchGroupDto.code,
          name: updateResearchGroupDto.name,
          description: updateResearchGroupDto.description,
          status: updateResearchGroupDto.status,
        },
      },
    );
    if (!res) {
      throw new NotFoundException('ResearchGroup not found');
    }
    return res;
  }

  async remove(id: string) {
    const researchGroup = await this.researchGroupModel.findOne({ id: id });
    if (!researchGroup) {
      throw new NotFoundException('ResearchGroup not found');
    }
    const res = await this.researchGroupModel.deleteOne({ id: id });
    if (!res) {
      throw new NotFoundException('ResearchGroup not found');
    }
    if (!res.acknowledged) {
      throw new Error('Delete operation not acknowledged by the database');
    }
    return `This action removes a #${id} researchGroup`;
  }
}
