const readline = require('readline');
const fs = require('fs');
const path = require('path');
const { template } = require('lodash');
const { spawn } = require('child_process');

// alias spawn
const exec = commands => {
  const tempSpawn = spawn(commands, { stdio: 'inherit', shell: true })
    .on('error', () => {
      console.log('stdout error...');
      process.exit();
    })
    .on('close', () => {
      console.log('stdout closed...');
      tempSpawn.disconnect();
      process.exit();
    })
    .on('exit', () => {
      console.log('stdout exit...');
      tempSpawn.kill();
      process.exit();
    });
};

readline.emitKeypressEvents(process.stdin);
process.stdin.setRawMode(true);

const FgRed = '\x1b[31m';
const FgGreen = '\x1b[32m';

let indexSelectedRoute = -1;
let serviceName = '';

let hasSelectRoutePath = false;
let hasEnteredServiceName = false;
let hasConfirm = false;
const pathSrcRoute = path.join(__dirname, 'src', 'route');
const pathReadTemplate = path.join(__dirname, 'src', 'base-module', 'template');
let pathWriteServiceTemplate = null;
const listRouteFolder = fs
  .readdirSync(pathSrcRoute)
  .filter(v => v.indexOf('.') < 0 && v !== 'app');
indexSelectedRoute = listRouteFolder.length - 1;
function isUpperCase(str) {
  return str === str.toUpperCase();
}

function toSlug(str, char = '-') {
  if (!str) return '';
  // eslint-disable-next-line func-names
  const _strArr = str.split('');
  for (let i = 0; i < _strArr.length; i += 1) {
    if (i > 0 && isUpperCase(_strArr[i]) && _strArr[i].length > 0) {
      _strArr[i] = `-${_strArr[i].toLowerCase()}`;
    } else {
      _strArr[i] = `${_strArr[i].toLowerCase()}`;
    }
  }
  let _str = _strArr.join('');
  _str = _str.replace(/(à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ)/g, 'a');
  _str = _str.replace(/(è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ)/g, 'e');
  _str = _str.replace(/(ì|í|ị|ỉ|ĩ)/g, 'i');
  _str = _str.replace(/(ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ)/g, 'o');
  _str = _str.replace(/(ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ)/g, 'u');
  _str = _str.replace(/(ỳ|ý|ỵ|ỷ|ỹ)/g, 'y');
  _str = _str.replace(/(đ)/g, 'd');
  _str = _str.replace(/([^0-9a-z-\s])/g, '');
  _str = _str.replace(/(\s+)/g, char);
  const regexRemvoeDuplicate = new RegExp(`${char}+`, 'g');
  _str = _str.replace(regexRemvoeDuplicate, char);
  return _str;
}

function getInputRoute() {
  const blank = '\n'.repeat(process.stdout.rows);
  console.log(blank);
  process.stdout.clearLine();
  process.stdout.cursorTo(0);
  console.log('Please select route path wanna create to continue:');
  for (let i = 0; i < listRouteFolder.length; i += 1) {
    if (indexSelectedRoute === i) {
      console.log(
        `${FgGreen}%s\x1b[0m`,
        listRouteFolder[i],
        FgGreen,
        '*\x1b[0m'
      );
    } else {
      console.log(listRouteFolder[i]);
    }
  }
}

function printInputRoute() {
  const blank = '\n'.repeat(process.stdout.rows);
  console.log(blank);
  process.stdout.clearLine();
  process.stdout.cursorTo(0);
  console.log(
    'Route selected:',
    `${FgGreen}${listRouteFolder[indexSelectedRoute]}\x1b[0m`
  );
}

function getInputService() {
  console.log(
    'Please enter service you wanna create (ex: Notification): ',
    serviceName
  );
}

function confirmPress() {
  pathWriteServiceTemplate = path.join(
    pathSrcRoute,
    listRouteFolder[indexSelectedRoute],
    toSlug(serviceName)
  );
  const blank = '\n'.repeat(process.stdout.rows);
  console.log(blank);
  process.stdout.clearLine();
  process.stdout.cursorTo(0);
  console.log(
    'Confirm that will create service name:',
    `${FgGreen}${serviceName}\x1b[0m`,
    'for route',
    `${FgGreen}${listRouteFolder[indexSelectedRoute]}\x1b[0m`,
    'at path',
    `${FgGreen}\x1b[0m`,
    `${FgGreen}${pathWriteServiceTemplate}\x1b[0m`
  );
  console.log('Do you wanna continue (Y/n):');
}

class TemplateFile {
  constructor(fileType, dataBinding) {
    this.mapFile = {
      controller: 'template.controller.hbs',
      module: 'template.module.hbs',
      repository: 'template.repository.hbs',
      service: 'template.service.hbs',
      dtoUpdate: 'dto/update-template.dto.hbs',
      dtoCreate: 'dto/create-template.dto.hbs',
      entity: 'entity/template.entity.hbs',
      specsController: 'specs/template.controller.spec.hbs',
      specsService: 'specs/template.service.spec.hbs',
    };
    this.path = pathWriteServiceTemplate;
    this.dataBinding = dataBinding;
    this.serviceNameSlug = toSlug(dataBinding.serviceName);
    this.fileName = `${`${this.mapFile[fileType]
      .replace('template', this.serviceNameSlug)
      .slice(0, -4)}.ts`}`;
    this.content = template(
      fs
        .readFileSync(`${pathReadTemplate}/${this.mapFile[fileType]}`)
        .toString()
    );
  }

  save() {
    try {
      const dataBinding = this.content(this.dataBinding);
      fs.writeFileSync(
        path.join(pathWriteServiceTemplate, this.fileName),
        dataBinding
      );
      console.log(
        'Run command',
        `pnpm prettier --write ${path.join(pathWriteServiceTemplate, this.fileName)}`
      );
      exec(
        `pnpm prettier --write ${path.join(pathWriteServiceTemplate, this.fileName)}`
      );
    } catch (e) {
      console.log('Binding error', e);
    }
  }

  getContent() {
    return this.content;
  }

  getName() {
    return this.fileName;
  }
}
async function generateTemplateService() {
  const dataBinding = {
    serviceName,
    serviceNameLowerCase:
      serviceName.charAt(0).toLowerCase() + serviceName.slice(1),
    serviceNameSlug: toSlug(serviceName),
    selectedRoute: listRouteFolder[indexSelectedRoute],
  };
  console.log('Generatting...');

  const pathWillWrite = [
    pathWriteServiceTemplate,
    path.join(pathWriteServiceTemplate, 'dto'),
    path.join(pathWriteServiceTemplate, 'entity'),
    path.join(pathWriteServiceTemplate, 'specs'),
  ];
  let willCreateNew = true;
  for (let i = 0; i < pathWillWrite.length; i += 1) {
    if (!fs.existsSync(pathWillWrite[i])) {
      fs.mkdirSync(pathWillWrite[i]);
    } else {
      willCreateNew = false;
      console.log(`${FgRed}Folder was exist:\x1b[0m ${pathWillWrite[i]}`);
      // break
    }
  }
  if (!willCreateNew) {
    console.log(`\r\n${FgRed}ERROR!!!\x1b[0m`);
    console.log(
      `${FgRed}We noticed that the directories of the service you want to create already exist.\x1b[0m`
    );
    console.log(
      `${FgRed}\t1. If this is your mistake, all your data will be the same as before.\x1b[0m`
    );
    console.log(
      `${FgRed}\t2. If you want to create a new service, delete the old folder and run it again.\x1b[0m\r\n`
    );
    process.exit();
  }
  new TemplateFile('controller', dataBinding).save();
  new TemplateFile('module', dataBinding).save();
  new TemplateFile('repository', dataBinding).save();
  new TemplateFile('service', dataBinding).save();
  new TemplateFile('dtoUpdate', dataBinding).save();
  new TemplateFile('dtoCreate', dataBinding).save();
  new TemplateFile('entity', dataBinding).save();
  new TemplateFile('specsController', dataBinding).save();
  new TemplateFile('specsService', dataBinding).save();
  console.log(`${FgGreen}DONE\x1b[0m`);
  console.log(`${FgRed}NOTICE!!!\x1b[0m`);
  console.log(
    `Please check ${FgGreen}${serviceName}Module\x1b[0m in ${FgGreen}${listRouteFolder[indexSelectedRoute]}.module.ts\x1b[0m if it not working`
  );

  const fileModuleDeclare = path.join(
    pathSrcRoute,
    listRouteFolder[indexSelectedRoute],
    `${listRouteFolder[indexSelectedRoute]}.module.ts`
  );
  const importModuleString = `import ${serviceName}Module from './${dataBinding.serviceNameSlug}/${dataBinding.serviceNameSlug}.module'\n// *** REPLACE_IMPORT_MODULE *** // Do not delete/modify this line`;
  const declareRouteString = `{ path: '/${dataBinding.serviceNameSlug}', module: ${serviceName}Module },\n      // *** REPLACE_INIT_ROUTE *** // Do not delete/modify this line`;

  let tempContent = fs.readFileSync(`${fileModuleDeclare}`).toString();
  tempContent = tempContent.replace(
    `// *** REPLACE_IMPORT_MODULE *** // Do not delete/modify this line`,
    importModuleString
  );
  tempContent = tempContent.replace(
    `// *** REPLACE_INIT_ROUTE *** // Do not delete/modify this line`,
    declareRouteString
  );
  fs.writeFileSync(fileModuleDeclare, tempContent);

  // Call prettier

  exec(`pnpm prettier --write ${fileModuleDeclare}`);
  process.exit();
}
function loop() {
  if (!hasSelectRoutePath) {
    getInputRoute();
  }
  if (!hasEnteredServiceName && hasSelectRoutePath) {
    printInputRoute();
    getInputService();
  }
  if (hasEnteredServiceName && hasSelectRoutePath) {
    printInputRoute();
    confirmPress();
  }
  if (hasEnteredServiceName && hasSelectRoutePath && hasConfirm) {
    confirmPress();
    generateTemplateService();
  }
}

function handleEnterPress(key) {
  if (
    !hasSelectRoutePath &&
    indexSelectedRoute > -1 &&
    indexSelectedRoute < listRouteFolder.length
  ) {
    hasSelectRoutePath = true;
    hasEnteredServiceName = false;
    serviceName = '';
    loop();
    return;
  }
  if (!hasEnteredServiceName && hasSelectRoutePath) {
    if (!serviceName || serviceName === '') return;
    hasEnteredServiceName = true;
    loop();
    return;
  }
  // loop()
  if (hasEnteredServiceName && hasSelectRoutePath && !hasConfirm) {
    hasConfirm = true;
    loop();
  }
}
function handleArrowUpDown(key) {
  if (key.code === '[A' && indexSelectedRoute > 0) indexSelectedRoute -= 1;
  if (key.code === '[B' && indexSelectedRoute < listRouteFolder.length - 1)
    indexSelectedRoute += 1;
  loop();
}
function isLetter(str) {
  if (!str) return false;
  return str.length === 1 && str.match(/[a-z]/i);
}
process.stdin.on('keypress', (str, key) => {
  if (key.ctrl && key.name === 'c') {
    process.exit(); // eslint-disable-line no-process-exit
  } else if (!hasSelectRoutePath) {
    if (str === '\r') {
      handleEnterPress(key);
      return;
    }
    if (key.code === '[A' || key.code === '[B') {
      handleArrowUpDown(key);
    }
  } else if (str === '\r') {
    handleEnterPress(key);
  } else if (hasSelectRoutePath && hasEnteredServiceName && !hasConfirm) {
    if (key.sequence === 'Y' || key.sequence === 'y') {
      hasConfirm = true;
      generateTemplateService();
    }
    if (key.sequence === 'N' || key.sequence === 'n') process.exit(); // eslint-disable-line no-process-exit
  } else if (!hasEnteredServiceName && hasSelectRoutePath) {
    if (isLetter(str)) {
      serviceName += str;
    }
    if (key.name === 'backspace') {
      serviceName = serviceName.slice(0, -1);
    }
    loop();
  }
});
console.log("Let's start");
loop();
