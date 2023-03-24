const Mustache = require('mustache');
var fs = require('fs');
const capitalizeFirstLetter = require('../util/capitalize');

class JavaGenerate {
  GenerateFile(JavaMustache, JavaTemplate, folder) {
    // GERA O MODEL DO JAVA
    const JavaGenerated = Mustache.render(JavaTemplate, JavaMustache);
    if (!fs.existsSync(process.env.CAMINHO_PARA_GERAR_JAVA + '/' + folder)) {
      fs.mkdirSync(process.env.CAMINHO_PARA_GERAR_JAVA + '/' + folder);
    }

    var isModel = folder == 'model';

    fs.writeFile(
      process.env.CAMINHO_PARA_GERAR_JAVA + '/' + folder + '/' + (JavaMustache.className + (isModel ? '' : capitalizeFirstLetter(folder)) + '.java'),
      JavaGenerated,
      function (err) {
        if (err) {
          console.log(err);
          throw err;
        }
      }
    );
  }
}

module.exports = JavaGenerate;

