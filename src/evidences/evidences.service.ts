import { Injectable } from '@nestjs/common';
import { CreateEvidenceDto } from './dto/create-evidence.dto';
import { Model } from 'mongoose';
import { Evidence } from './entities/evidence.entity';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class EvidencesService {
  constructor(
    @InjectModel('Evidence')
    private readonly evidenceModel: Model<Evidence>,
  ) {}

  async create(createEvidenceDto: CreateEvidenceDto) {
    const evidence = new this.evidenceModel(createEvidenceDto);
    const res = await evidence.save();
    return res;
  }

  async findAll() {
    const evidences = await this.evidenceModel.find();
    if (!evidences) {
      throw new Error('Evidences not found');
    }
    return evidences;
  }

  async findOne(uuid: string) {
    const evidence = await this.evidenceModel.findOne({ id: uuid });
    if (!evidence) {
      throw new Error('Evidence not found');
    }
    return evidence;
  }

  async remove(uuid: string) {
    const evidence = await this.evidenceModel.findOne({ key: uuid });
    if (!evidence) {
      throw new Error('Evidence not found');
    }
    const res = await this.evidenceModel.deleteOne({ _id: evidence._id });
    if (!res) {
      throw new Error('Evidence not found');
    }
    if (!res.acknowledged) {
      throw new Error('Delete operation not acknowledged by the database');
    }
    if (res.deletedCount === 0) {
      throw new Error('Evidence not found');
    }
    if (res.deletedCount > 1) {
      throw new Error('Multiple evidences deleted');
    }
    return 'Evidence deleted';
  }
}
