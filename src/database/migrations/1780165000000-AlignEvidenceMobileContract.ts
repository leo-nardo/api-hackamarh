import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlignEvidenceMobileContract1780165000000 implements MigrationInterface {
  name = 'AlignEvidenceMobileContract1780165000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "evidence" ADD "property_id" uuid`);
    await queryRunner.query(
      `ALTER TABLE "evidence" ADD "altitude" double precision`,
    );
    await queryRunner.query(
      `ALTER TABLE "evidence" ADD "device_model" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "evidence" RENAME COLUMN "validation_status" TO "status"`,
    );
    await queryRunner.query(
      `ALTER INDEX "IDX_evidence_validation_status" RENAME TO "IDX_evidence_status"`,
    );
    await queryRunner.query(
      `ALTER TABLE "evidence" ALTER COLUMN "status" SET DEFAULT 'pending'`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_evidence_property_id" ON "evidence" ("property_id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "evidence" ADD CONSTRAINT "FK_evidence_property" FOREIGN KEY ("property_id") REFERENCES "property"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "evidence" DROP CONSTRAINT "FK_evidence_property"`,
    );
    await queryRunner.query(`DROP INDEX "public"."IDX_evidence_property_id"`);
    await queryRunner.query(
      `ALTER TABLE "evidence" ALTER COLUMN "status" SET DEFAULT 'pending'`,
    );
    await queryRunner.query(
      `ALTER INDEX "IDX_evidence_status" RENAME TO "IDX_evidence_validation_status"`,
    );
    await queryRunner.query(
      `ALTER TABLE "evidence" RENAME COLUMN "status" TO "validation_status"`,
    );
    await queryRunner.query(
      `ALTER TABLE "evidence" DROP COLUMN "device_model"`,
    );
    await queryRunner.query(`ALTER TABLE "evidence" DROP COLUMN "altitude"`);
    await queryRunner.query(`ALTER TABLE "evidence" DROP COLUMN "property_id"`);
  }
}
