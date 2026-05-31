import { plainToClass } from 'class-transformer';
import { validateSync } from 'class-validator';
import { ClassConstructor } from 'class-transformer/types/interfaces';

function validateConfig<T extends object>(
  config: Record<string, unknown>,
  envVariablesClass: ClassConstructor<T>,
) {
  const validatedConfig = plainToClass(envVariablesClass, config, {
    enableImplicitConversion: true,
  });
  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    console.log('!!! CONFIGURATION ERROR: Missing or invalid environment variables !!!');
    errors.forEach((err) => {
      console.log(`- Property: ${err.property}`);
      if (err.constraints) {
        Object.values(err.constraints).forEach((constraint) => {
          console.log(`  Error: ${constraint}`);
        });
      }
    });
    throw new Error(errors.toString());
  }
  return validatedConfig;
}

export default validateConfig;
