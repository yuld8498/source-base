import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUserTable1751689658173 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE "users" (
            "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
            "email" character varying NOT NULL,
            "firstName" character varying,
            "lastName" character varying,
            "password" character varying,
            "isActive" character varying,
            "createdAt" TIMESTAMP DEFAULT CURRENT_DATE,
            "updatedAt" TIMESTAMP DEFAULT CURRENT_DATE,
            CONSTRAINT "PK_users" PRIMARY KEY ("id")
        )`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
