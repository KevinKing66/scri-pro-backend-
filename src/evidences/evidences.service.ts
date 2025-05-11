import { Injectable } from '@nestjs/common';
import { CreateEvidenceDto } from './dto/create-evidence.dto';
import { Model } from 'mongoose';
import { Evidence } from './entities/evidence.entity';
import { InjectModel } from '@nestjs/mongoose';
import { AwsService } from 'src/aws/aws.service';

@Injectable()
export class EvidencesService {
  constructor(
    @InjectModel('Evidence')
    private readonly evidenceModel: Model<Evidence>,
    private readonly awsService: AwsService,
  ) {}

  async create(createEvidenceDto: CreateEvidenceDto) {
    const key = await this.awsService.uploadBase64Image(
      createEvidenceDto.content,
    );
    const evidence = new this.evidenceModel({ ...createEvidenceDto, key: key });
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

  async findOne(_id: string) {
    const evidence = await this.evidenceModel.findOne({ _id: _id });

    if (!evidence) {
      throw new Error('Evidence not found');
    }

    const key = evidence?.key ?? '';
    if (evidence && evidence.type === 'image') {
      evidence.url = await this.awsService.getFileUrl(key);
    } else {
      evidence.url = await this.awsService.getDownloadUrl(evidence.key);
    }
    return evidence;
  }

  async remove(uuid: string) {
    const evidence = await this.evidenceModel.findOne({ key: uuid });
    if (!evidence) {
      throw new Error('Evidence not found');
    }
    await this.awsService.deleteFile(evidence.key);
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
