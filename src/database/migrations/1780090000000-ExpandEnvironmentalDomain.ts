import { MigrationInterface, QueryRunner } from 'typeorm';

export class ExpandEnvironmentalDomain1780090000000 implements MigrationInterface {
  name = 'ExpandEnvironmentalDomain1780090000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "postgis"`);
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);

    await queryRunner.query(
      `CREATE TABLE "property" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "car_code" character varying NOT NULL, "name" character varying NOT NULL, "owner_name" character varying, "owner_document" character varying, "municipality" character varying, "state" character varying, "total_area_ha" numeric(12,2), "geom" geometry(Polygon,4326), "source" character varying NOT NULL DEFAULT 'manual', "external_code" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_property" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_property_car_code" ON "property" ("car_code")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_property_geom" ON "property" USING GiST ("geom")`,
    );

    await queryRunner.query(
      `CREATE TABLE "property_user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "property_id" uuid NOT NULL, "user_id" integer NOT NULL, "role" character varying NOT NULL DEFAULT 'owner', "can_submit_evidence" boolean NOT NULL DEFAULT false, "can_manage_property" boolean NOT NULL DEFAULT false, "starts_at" TIMESTAMP WITH TIME ZONE, "ends_at" TIMESTAMP WITH TIME ZONE, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_property_user" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_property_user_property_id" ON "property_user" ("property_id")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_property_user_user_id" ON "property_user" ("user_id")`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_property_user_scope" ON "property_user" ("property_id", "user_id", "role")`,
    );

    await queryRunner.query(
      `CREATE TABLE "external_reference" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "source" character varying NOT NULL, "reference_type" character varying NOT NULL, "title" character varying NOT NULL, "url" text, "external_id" character varying, "entity_type" character varying NOT NULL, "entity_id" character varying NOT NULL, "captured_at" TIMESTAMP WITH TIME ZONE, "metadata_json" jsonb, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_external_reference" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_external_reference_entity" ON "external_reference" ("entity_type", "entity_id")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_external_reference_source" ON "external_reference" ("source")`,
    );

    await queryRunner.query(
      `CREATE TABLE "external_observation" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "source" character varying NOT NULL, "observation_type" character varying NOT NULL, "entity_type" character varying NOT NULL, "entity_id" character varying NOT NULL, "observed_at" TIMESTAMP WITH TIME ZONE NOT NULL, "period_start" TIMESTAMP WITH TIME ZONE, "period_end" TIMESTAMP WITH TIME ZONE, "query_params" jsonb, "metrics" jsonb, "geom" geometry(Geometry,4326), "raw_payload" jsonb, "confidence_score" double precision, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_external_observation" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_external_observation_entity" ON "external_observation" ("entity_type", "entity_id")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_external_observation_source" ON "external_observation" ("source", "observation_type")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_external_observation_geom" ON "external_observation" USING GiST ("geom")`,
    );

    await queryRunner.query(
      `CREATE TABLE "restoration_plan" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "property_id" uuid NOT NULL, "title" character varying NOT NULL, "status" character varying NOT NULL DEFAULT 'draft', "plan_type" character varying NOT NULL DEFAULT 'prad', "created_by" integer, "current_version_id" uuid, "approved_at" TIMESTAMP WITH TIME ZONE, "notes" text, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_restoration_plan" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_restoration_plan_property_id" ON "restoration_plan" ("property_id")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_restoration_plan_created_by" ON "restoration_plan" ("created_by")`,
    );

    await queryRunner.query(
      `CREATE TABLE "restoration_plan_version" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "restoration_plan_id" uuid NOT NULL, "version_number" integer NOT NULL, "source" character varying NOT NULL DEFAULT 'technician', "status" character varying NOT NULL DEFAULT 'proposed', "proposed_by" integer, "document_url" text, "summary" text, "content_json" jsonb, "submitted_at" TIMESTAMP WITH TIME ZONE, "approved_at" TIMESTAMP WITH TIME ZONE, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_restoration_plan_version" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_restoration_plan_version_plan_id" ON "restoration_plan_version" ("restoration_plan_id")`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_restoration_plan_version_number" ON "restoration_plan_version" ("restoration_plan_id", "version_number")`,
    );

    await queryRunner.query(
      `CREATE TABLE "affected_area" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "property_id" uuid NOT NULL, "restoration_plan_version_id" uuid, "name" character varying NOT NULL, "area_type" character varying NOT NULL DEFAULT 'restoration', "status" character varying NOT NULL DEFAULT 'active', "geom" geometry(Polygon,4326) NOT NULL, "area_ha" numeric(12,2), "priority" integer, "notes" text, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_affected_area" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_affected_area_property_id" ON "affected_area" ("property_id")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_affected_area_restoration_plan_version_id" ON "affected_area" ("restoration_plan_version_id")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_affected_area_geom" ON "affected_area" USING GiST ("geom")`,
    );

    await queryRunner.query(
      `CREATE TABLE "collection_point" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "affected_area_id" uuid NOT NULL, "name" character varying NOT NULL, "point_type" character varying NOT NULL DEFAULT 'field_photo', "location" geometry(Point,4326) NOT NULL, "radius_meters" integer NOT NULL DEFAULT 30, "required_photo_count" integer NOT NULL DEFAULT 1, "instructions" text, "sort_order" integer NOT NULL DEFAULT 0, "is_active" boolean NOT NULL DEFAULT true, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_collection_point" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_collection_point_affected_area_id" ON "collection_point" ("affected_area_id")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_collection_point_location" ON "collection_point" USING GiST ("location")`,
    );

    await queryRunner.query(
      `ALTER TABLE "mission" ADD "affected_area_id" uuid`,
    );
    await queryRunner.query(`ALTER TABLE "mission" ADD "objective" text`);
    await queryRunner.query(`ALTER TABLE "mission" ADD "created_by" integer`);
    await queryRunner.query(
      `ALTER TABLE "mission" ADD "priority" character varying NOT NULL DEFAULT 'normal'`,
    );
    await queryRunner.query(`ALTER TABLE "mission" ADD "due_date" date`);
    await queryRunner.query(
      `ALTER TABLE "mission" ALTER COLUMN "codigo_car" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "mission" ALTER COLUMN "poligono" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "mission" ALTER COLUMN "status" SET DEFAULT 'scheduled'`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_mission_affected_area_id" ON "mission" ("affected_area_id")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_mission_created_by" ON "mission" ("created_by")`,
    );

    await queryRunner.query(
      `CREATE TABLE "mission_schedule" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "mission_id" uuid NOT NULL, "starts_at" TIMESTAMP WITH TIME ZONE NOT NULL, "ends_at" TIMESTAMP WITH TIME ZONE NOT NULL, "deadline_at" TIMESTAMP WITH TIME ZONE, "recurrence_rule" character varying, "status" character varying NOT NULL DEFAULT 'scheduled', "notes" text, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_mission_schedule" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_mission_schedule_mission_id" ON "mission_schedule" ("mission_id")`,
    );

    await queryRunner.query(
      `ALTER TABLE "evidence" ADD "collection_point_id" uuid`,
    );
    await queryRunner.query(
      `ALTER TABLE "evidence" ADD "technician_id" integer`,
    );
    await queryRunner.query(
      `ALTER TABLE "evidence" ADD "submitted_at" TIMESTAMP WITH TIME ZONE`,
    );
    await queryRunner.query(
      `ALTER TABLE "evidence" ADD "fase_sucessional" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "evidence" ADD "metodo_restauracao" character varying`,
    );
    await queryRunner.query(`ALTER TABLE "evidence" ADD "notes" text`);
    await queryRunner.query(
      `ALTER TABLE "evidence" ADD "validation_status" character varying NOT NULL DEFAULT 'pending'`,
    );
    await queryRunner.query(
      `ALTER TABLE "evidence" ADD "validation_reason" text`,
    );
    await queryRunner.query(
      `ALTER TABLE "evidence" ADD "validated_by" integer`,
    );
    await queryRunner.query(
      `ALTER TABLE "evidence" ADD "validated_at" TIMESTAMP WITH TIME ZONE`,
    );
    await queryRunner.query(
      `ALTER TABLE "evidence" ALTER COLUMN "foto_url" TYPE text`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_evidence_collection_point_id" ON "evidence" ("collection_point_id")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_evidence_technician_id" ON "evidence" ("technician_id")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_evidence_validation_status" ON "evidence" ("validation_status")`,
    );

    await queryRunner.query(
      `ALTER TABLE "property_user" ADD CONSTRAINT "FK_property_user_property" FOREIGN KEY ("property_id") REFERENCES "property"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "property_user" ADD CONSTRAINT "FK_property_user_user" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "restoration_plan" ADD CONSTRAINT "FK_restoration_plan_property" FOREIGN KEY ("property_id") REFERENCES "property"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "restoration_plan" ADD CONSTRAINT "FK_restoration_plan_created_by" FOREIGN KEY ("created_by") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "restoration_plan_version" ADD CONSTRAINT "FK_restoration_plan_version_plan" FOREIGN KEY ("restoration_plan_id") REFERENCES "restoration_plan"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "restoration_plan_version" ADD CONSTRAINT "FK_restoration_plan_version_proposed_by" FOREIGN KEY ("proposed_by") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "restoration_plan" ADD CONSTRAINT "FK_restoration_plan_current_version" FOREIGN KEY ("current_version_id") REFERENCES "restoration_plan_version"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "affected_area" ADD CONSTRAINT "FK_affected_area_property" FOREIGN KEY ("property_id") REFERENCES "property"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "affected_area" ADD CONSTRAINT "FK_affected_area_restoration_plan_version" FOREIGN KEY ("restoration_plan_version_id") REFERENCES "restoration_plan_version"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "collection_point" ADD CONSTRAINT "FK_collection_point_affected_area" FOREIGN KEY ("affected_area_id") REFERENCES "affected_area"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "mission" ADD CONSTRAINT "FK_mission_affected_area" FOREIGN KEY ("affected_area_id") REFERENCES "affected_area"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "mission" ADD CONSTRAINT "FK_mission_created_by" FOREIGN KEY ("created_by") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "mission_schedule" ADD CONSTRAINT "FK_mission_schedule_mission" FOREIGN KEY ("mission_id") REFERENCES "mission"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "evidence" ADD CONSTRAINT "FK_evidence_collection_point" FOREIGN KEY ("collection_point_id") REFERENCES "collection_point"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "evidence" ADD CONSTRAINT "FK_evidence_technician" FOREIGN KEY ("technician_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "evidence" ADD CONSTRAINT "FK_evidence_validated_by" FOREIGN KEY ("validated_by") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "evidence" DROP CONSTRAINT "FK_evidence_validated_by"`,
    );
    await queryRunner.query(
      `ALTER TABLE "evidence" DROP CONSTRAINT "FK_evidence_technician"`,
    );
    await queryRunner.query(
      `ALTER TABLE "evidence" DROP CONSTRAINT "FK_evidence_collection_point"`,
    );
    await queryRunner.query(
      `ALTER TABLE "mission_schedule" DROP CONSTRAINT "FK_mission_schedule_mission"`,
    );
    await queryRunner.query(
      `ALTER TABLE "mission" DROP CONSTRAINT "FK_mission_created_by"`,
    );
    await queryRunner.query(
      `ALTER TABLE "mission" DROP CONSTRAINT "FK_mission_affected_area"`,
    );
    await queryRunner.query(
      `ALTER TABLE "collection_point" DROP CONSTRAINT "FK_collection_point_affected_area"`,
    );
    await queryRunner.query(
      `ALTER TABLE "affected_area" DROP CONSTRAINT "FK_affected_area_restoration_plan_version"`,
    );
    await queryRunner.query(
      `ALTER TABLE "affected_area" DROP CONSTRAINT "FK_affected_area_property"`,
    );
    await queryRunner.query(
      `ALTER TABLE "restoration_plan" DROP CONSTRAINT "FK_restoration_plan_current_version"`,
    );
    await queryRunner.query(
      `ALTER TABLE "restoration_plan_version" DROP CONSTRAINT "FK_restoration_plan_version_proposed_by"`,
    );
    await queryRunner.query(
      `ALTER TABLE "restoration_plan_version" DROP CONSTRAINT "FK_restoration_plan_version_plan"`,
    );
    await queryRunner.query(
      `ALTER TABLE "restoration_plan" DROP CONSTRAINT "FK_restoration_plan_created_by"`,
    );
    await queryRunner.query(
      `ALTER TABLE "restoration_plan" DROP CONSTRAINT "FK_restoration_plan_property"`,
    );
    await queryRunner.query(
      `ALTER TABLE "property_user" DROP CONSTRAINT "FK_property_user_user"`,
    );
    await queryRunner.query(
      `ALTER TABLE "property_user" DROP CONSTRAINT "FK_property_user_property"`,
    );

    await queryRunner.query(
      `DROP INDEX "public"."IDX_evidence_validation_status"`,
    );
    await queryRunner.query(`DROP INDEX "public"."IDX_evidence_technician_id"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_evidence_collection_point_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "evidence" DROP COLUMN "validated_at"`,
    );
    await queryRunner.query(
      `ALTER TABLE "evidence" DROP COLUMN "validated_by"`,
    );
    await queryRunner.query(
      `ALTER TABLE "evidence" DROP COLUMN "validation_reason"`,
    );
    await queryRunner.query(
      `ALTER TABLE "evidence" DROP COLUMN "validation_status"`,
    );
    await queryRunner.query(`ALTER TABLE "evidence" DROP COLUMN "notes"`);
    await queryRunner.query(
      `ALTER TABLE "evidence" DROP COLUMN "metodo_restauracao"`,
    );
    await queryRunner.query(
      `ALTER TABLE "evidence" DROP COLUMN "fase_sucessional"`,
    );
    await queryRunner.query(
      `ALTER TABLE "evidence" DROP COLUMN "submitted_at"`,
    );
    await queryRunner.query(
      `ALTER TABLE "evidence" DROP COLUMN "technician_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "evidence" DROP COLUMN "collection_point_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "evidence" ALTER COLUMN "foto_url" TYPE character varying`,
    );

    await queryRunner.query(
      `DROP INDEX "public"."IDX_mission_schedule_mission_id"`,
    );
    await queryRunner.query(`DROP TABLE "mission_schedule"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_mission_created_by"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_mission_affected_area_id"`,
    );
    await queryRunner.query(`ALTER TABLE "mission" DROP COLUMN "due_date"`);
    await queryRunner.query(`ALTER TABLE "mission" DROP COLUMN "priority"`);
    await queryRunner.query(`ALTER TABLE "mission" DROP COLUMN "created_by"`);
    await queryRunner.query(`ALTER TABLE "mission" DROP COLUMN "objective"`);
    await queryRunner.query(
      `ALTER TABLE "mission" DROP COLUMN "affected_area_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "mission" ALTER COLUMN "status" SET DEFAULT 'pending'`,
    );

    await queryRunner.query(
      `DROP INDEX "public"."IDX_collection_point_location"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_collection_point_affected_area_id"`,
    );
    await queryRunner.query(`DROP TABLE "collection_point"`);

    await queryRunner.query(`DROP INDEX "public"."IDX_affected_area_geom"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_affected_area_restoration_plan_version_id"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_affected_area_property_id"`,
    );
    await queryRunner.query(`DROP TABLE "affected_area"`);

    await queryRunner.query(
      `DROP INDEX "public"."IDX_restoration_plan_version_number"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_restoration_plan_version_plan_id"`,
    );
    await queryRunner.query(`DROP TABLE "restoration_plan_version"`);

    await queryRunner.query(
      `DROP INDEX "public"."IDX_restoration_plan_created_by"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_restoration_plan_property_id"`,
    );
    await queryRunner.query(`DROP TABLE "restoration_plan"`);

    await queryRunner.query(
      `DROP INDEX "public"."IDX_external_observation_geom"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_external_observation_source"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_external_observation_entity"`,
    );
    await queryRunner.query(`DROP TABLE "external_observation"`);

    await queryRunner.query(
      `DROP INDEX "public"."IDX_external_reference_source"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_external_reference_entity"`,
    );
    await queryRunner.query(`DROP TABLE "external_reference"`);

    await queryRunner.query(`DROP INDEX "public"."IDX_property_user_scope"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_property_user_user_id"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_property_user_property_id"`,
    );
    await queryRunner.query(`DROP TABLE "property_user"`);

    await queryRunner.query(`DROP INDEX "public"."IDX_property_geom"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_property_car_code"`);
    await queryRunner.query(`DROP TABLE "property"`);
  }
}
