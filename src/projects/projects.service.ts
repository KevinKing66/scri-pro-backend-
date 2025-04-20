import { Injectable } from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Project } from './entities/project.entity';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectModel('Project')
    private readonly projectModel: Model<Project>,
  ) {}

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
