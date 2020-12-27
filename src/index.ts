import fs from 'fs/promises';
import path from 'path';
import { F_OK } from 'constants';
import { EOL } from 'os';

import { convert } from './converter';
import { loadConfig } from '../utils';

async function main() {
  const config = await loadConfig();

  const filePaths = [
    path.resolve(config.stellarisPath, 'common/scripted_variables/00_scripted_variables.txt'),
    path.resolve(config.stellarisPath, 'common/scripted_variables/01_scripted_variables_megacorp.txt'),
    path.resolve(config.stellarisPath, 'common/scripted_variables/02_scripted_variables_component_cost.txt'),
    path.resolve(config.stellarisPath, 'common/scripted_variables/03_scripted_variables_ships.txt'),
    path.resolve(config.stellarisPath, 'common/ship_sizes/00_ship_sizes.txt'),
    path.resolve(config.stellarisPath, 'common/ship_sizes/01_colossi.txt'),
    path.resolve(config.stellarisPath, 'common/ship_sizes/18_juggernauts.txt'),
    path.resolve(config.stellarisPath, 'common/component_sets/00_fallen_empire_utilities.txt'),
    path.resolve(config.stellarisPath, 'common/component_sets/00_leviathans_utilities.txt'),
    path.resolve(config.stellarisPath, 'common/component_sets/00_required_sets.txt'),
    path.resolve(config.stellarisPath, 'common/component_sets/00_utilities_afterburners.txt'),
    path.resolve(config.stellarisPath, 'common/component_sets/00_utilities_aux_megacorp.txt'),
    path.resolve(config.stellarisPath, 'common/component_sets/00_utilities_aux.txt'),
    path.resolve(config.stellarisPath, 'common/component_sets/00_utilities_reactors.txt'),
    path.resolve(config.stellarisPath, 'common/component_sets/00_utilities_shields.txt'),
    path.resolve(config.stellarisPath, 'common/component_sets/00_utilities.txt'),
    path.resolve(config.stellarisPath, 'common/component_sets/00_weapons_energy.txt'),
    path.resolve(config.stellarisPath, 'common/component_sets/00_weapons_missiles.txt'),
    path.resolve(config.stellarisPath, 'common/component_sets/00_weapons_planet_killer.txt'),
    path.resolve(config.stellarisPath, 'common/component_sets/00_weapons_pointdefence.txt'),
    path.resolve(config.stellarisPath, 'common/component_sets/00_weapons_projectile.txt'),
    path.resolve(config.stellarisPath, 'common/component_sets/00_weapons_special.txt'),
    path.resolve(config.stellarisPath, 'common/component_templates/00_utilities_afterburners.txt'),
    path.resolve(config.stellarisPath, 'common/component_templates/00_utilities_auras.txt'),
    path.resolve(config.stellarisPath, 'common/component_templates/00_utilities_aux.txt'),
    path.resolve(config.stellarisPath, 'common/component_templates/00_utilities_aux_distant_stars.txt'),
    path.resolve(config.stellarisPath, 'common/component_templates/00_utilities_aux_megacorp.txt'),
    path.resolve(config.stellarisPath, 'common/component_templates/00_utilities_drives.txt'),
    path.resolve(config.stellarisPath, 'common/component_templates/00_utilities_reactors.txt'),
    path.resolve(config.stellarisPath, 'common/component_templates/00_utilities_roles.txt'),
    path.resolve(config.stellarisPath, 'common/component_templates/00_utilities_sensors.txt'),
    path.resolve(config.stellarisPath, 'common/component_templates/00_utilities_shields.txt'),
    path.resolve(config.stellarisPath, 'common/component_templates/00_utilities_thrusters.txt'),
  ];

  let convertedCount = 0;
  let skippedCount = 0;
  const failed: Array<string> = [];

  process.stdout.write(`Converting ${filePaths.length} files...`);

  await Promise.all(
    filePaths.map(async filePath => {
      const outFilePath = filePath.replace('.txt', '.json');
      const fileExists = await fs.access(outFilePath, F_OK).then(
        () => true,
        () => false
      );

      if (fileExists) {
        skippedCount++;
        return;
      }

      try {
        const text = await fs.readFile(filePath, 'utf8');
        const json = convert(text);

        await fs.writeFile(outFilePath, JSON.stringify(JSON.parse(json), null, 2));
        convertedCount++;
      } catch {
        failed.push(filePath);
      }
    })
  );

  process.stdout.write(
    ` done (${convertedCount} converted, ${skippedCount} skipped${
      failed.length ? `, ${failed.length} failed` : ''
    })${EOL}`
  );

  if (failed.length) {
    process.stdout.write(`The following files failed:${EOL}`);
    failed.forEach(filePath => {
      process.stdout.write(`  ${filePath}${EOL}`);
    });
  }
}

main().catch(e => console.error(e));
