import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddInviteCodeToUser1780225645752 implements MigrationInterface {
  name = 'AddInviteCodeToUser1780225645752';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user" ADD "invite_code" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD "invite_expires" TIMESTAMP WITH TIME ZONE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "invite_expires"`);
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "invite_code"`);
  }
}
