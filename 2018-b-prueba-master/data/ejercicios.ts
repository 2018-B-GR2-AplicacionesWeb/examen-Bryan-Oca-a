//1) Busque los tipos de "gender" en el arreglo `people.json`

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
    return new Promise(
        (resolve, reject) => {
            fs.readFile(
                'people.json',
                'utf-8',
                (error, contenidoArchivo) => { // CALLBACK
                    if (error) {
                        fs.writeFile(
                            'people.json',
                            '{"gender":[]}',
                            (error) => {
                                if (error) {
                                    reject({
                                        mensaje: 'Error creando',
                                        error: 500
                                    })
                                } else {
                                    resolve({
                                        mensaje: 'BDD leida',
                                        bdd: JSON.parse('{"gender":[]}')
                                    })
                                }

                            }
                        )

                    } else {
                        resolve({
                            mensaje: 'BDD leida',
                            bdd: JSON.parse(contenidoArchivo)
                        })
                    }
                }
            )
        }
    );
}

async function main() {

    const respuestaBDD$ = rxjs.from(inicialiarBDD());

    respuestaBDD$
        .pipe(
            buscarTiposGender()

        )
        .subscribe(
            (data) => {
                //
                console.log(data);
            },
            (error) => {
                //
                console.log(error);
            },
            () => {
                main();
                console.log('Complete');
            }
        )

}

main();

function preguntarOpcionesMenu() {
    return mergeMap( // Respuesta Anterior Observable
        (respuestaBDD: RespuestaBDD) => {
            return rxjs
                .from(inquirer.prompt(preguntaMenu))
                .pipe(
                    map( // respuesta ant obs
                        (respuesta: OpcionMenu) => {
                            respuestaBDD.opcionMenu = respuesta;
                            return respuestaBDD
                            // Cualquier cosa JS
                        }
                    )
                );

            // OBSERVABLE!!!!!!!!!!
        }
    )
}

function opcionesRespuesta() {
    return mergeMap(
        (respuestaBDD: RespuestaBDD) => {
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
        }
    )
}

interface RespuestaBDD {
    mensaje: string;
    bdd: BDD;
    gender?: People;
    opcionMenu?: OpcionMenu;
}

interface BDD {
    gender: People;
}

interface People {
    gender: string;
}

interface OpcionMenu {
    opcionMenu: 'Busque los tipos de "gender" en el arreglo people.json' | 'Busque los tipos de "eye_color" en el arreglo people.json' | 'Busque los tipos de "skin_color" en el arreglo people.json' | 'Actualizar';
}

interface BuscarUsuarioPorGender {
    gender: string;
}

function buscarTiposGender() {
    return mergeMap((respuesta)=>{
        var arregloActores=respuesta;
        arregloActores.forEach((elemento)=>{
            console.log(elemento['gender']);
        })


    })

}
