//1) Busque los tipos de "gender" en el arreglo `people.json`
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const inquirer = require('inquirer');
const fs = require('fs');
const rxjs = require('rxjs');
const timer = require('rxjs').timer;
const mergeMap = require('rxjs/operators').mergeMap;
const map = require('rxjs/operators').map;
const retryWhen = require('rxjs/operators').retryWhen;
const delayWhen = require('rxjs/operators').delayWhen;
const preguntaMenu = {
    type: 'list',
    name: 'opcionMenu',
    message: 'Que quieres hacer',
    choices: [
        'Busque los tipos de "gender" en el arreglo people.json',
        'Busque los tipos de "eye_color" en el arreglo people.json',
        'Busque los tipos de "skin_color" en el arreglo people.json',
        'Busque los tipos de "hair_color" en el arreglo people.json',
    ]
};
const preguntaBuscarGender = [
    {
        type: 'input',
        name: 'gender',
        message: 'Exito',
    }
];
function inicialiarBDD() {
    return new Promise((resolve, reject) => {
        fs.readFile('people.json', 'utf-8', (error, contenidoArchivo) => {
            if (error) {
                fs.writeFile('people.json', '{"gender":[]}', (error) => {
                    if (error) {
                        reject({
                            mensaje: 'Error creando',
                            error: 500
                        });
                    }
                    else {
                        resolve({
                            mensaje: 'BDD leida',
                            bdd: JSON.parse('{"gender":[]}')
                        });
                    }
                });
            }
            else {
                resolve({
                    mensaje: 'BDD leida',
                    bdd: JSON.parse(contenidoArchivo)
                });
            }
        });
    });
}
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        // 1) Inicializar people -- DONE
        // 2) Preguntas Menu -- DONE
        // 3) Opciones de Respuesta --  DONE
        // 4) ACCCION!!!!  -- DONE
        // 5) Guardar BDD --
        // of(Cualquier cosa JS)
        // from(Promesas)
        const respuestaBDD$ = rxjs.from(inicialiarBDD());
        respuestaBDD$
            .pipe(preguntarOpcionesMenu(), opcionesRespuesta())
            .subscribe((data) => {
            //
            console.log(data);
        }, (error) => {
            //
            console.log(error);
        }, () => {
            main();
            console.log('Complete');
        });
    });
}
main();
function preguntarOpcionesMenu() {
    return mergeMap(// Respuesta Anterior Observable
    (respuestaBDD) => {
        return rxjs
            .from(inquirer.prompt(preguntaMenu))
            .pipe(map(// respuesta ant obs
        (respuesta) => {
            respuestaBDD.opcionMenu = respuesta;
            return respuestaBDD;
            // Cualquier cosa JS
        }));
        // OBSERVABLE!!!!!!!!!!
    });
}
function opcionesRespuesta() {
    return mergeMap((respuestaBDD) => {
        const opcion = respuestaBDD.opcionMenu.opcionMenu;
        switch (opcion) {
            case 'Busque los tipos de "gender" en el arreglo people.json':
                return buscarTiposGender();
                break;
            case 'Busque los tipos de "eye_color" en el arreglo people.json':
                break;
            case 'Busque los tipos de "skin_color" en el arreglo people.json':
            case 'Actualizar':
                break;
        }
    });
}
function buscarTiposGender() {
    return mergeMap((respuesta) => {
        var arregloActores = respuesta;
        arregloActores.forEach((elemento) => {
            console.log(elemento['gender']);
        });
    });
}
