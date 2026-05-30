import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateEnvironmentalMonitoring1780086341403 implements MigrationInterface {
  name = 'CreateEnvironmentalMonitoring1780086341403';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "postgis"`);
    await queryRunner.query(
      `CREATE TABLE "mission" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "nome" character varying NOT NULL, "codigo_car" character varying NOT NULL, "poligono" geometry(Polygon,4326) NOT NULL, "status" character varying NOT NULL DEFAULT 'pending', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "tecnico_id" integer NOT NULL, CONSTRAINT "PK_478c65e8924bfa1a5b0ba97a04d" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_mission_tecnico_id" ON "mission" ("tecnico_id")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_mission_poligono" ON "mission" USING GiST ("poligono")`,
    );
    await queryRunner.query(
      `CREATE TABLE "evidence" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "coordenada" geometry(Point,4326) NOT NULL, "foto_url" character varying NOT NULL, "timestamp" TIMESTAMP WITH TIME ZONE NOT NULL, "mortalidade_taxa" double precision, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "mission_id" uuid NOT NULL, CONSTRAINT "PK_e96bb0d74547a477a97217ece29" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_evidence_mission_id" ON "evidence" ("mission_id")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_evidence_coordenada" ON "evidence" USING GiST ("coordenada")`,
    );
    await queryRunner.query(
      `ALTER TABLE "mission" ADD CONSTRAINT "FK_mission_tecnico" FOREIGN KEY ("tecnico_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "evidence" ADD CONSTRAINT "FK_evidence_mission" FOREIGN KEY ("mission_id") REFERENCES "mission"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "evidence" DROP CONSTRAINT "FK_evidence_mission"`,
    );
    await queryRunner.query(
      `ALTER TABLE "mission" DROP CONSTRAINT "FK_mission_tecnico"`,
    );
    await queryRunner.query(`DROP INDEX "public"."IDX_evidence_coordenada"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_evidence_mission_id"`);
    await queryRunner.query(`DROP TABLE "evidence"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_mission_poligono"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_mission_tecnico_id"`);
    await queryRunner.query(`DROP TABLE "mission"`);
  }
}
