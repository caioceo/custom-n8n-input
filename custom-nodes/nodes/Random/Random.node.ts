import { IExecuteFunctions } from 'n8n-workflow';
import {
    INodeType,
    INodeTypeDescription,
    INodeProperties,
} from 'n8n-workflow';

export class Random implements INodeType {
    description: INodeTypeDescription = {
        displayName: 'Random',
        name: 'random',
        group: ['input'],
        version: 1,
        description: 'Random number generator',
        defaults: {
            name: 'Random',
        },
        inputs: ['main'],
        outputs: ['main'],
        icon: 'file:Random.svg',
        properties: [
            {
                displayName: 'Operation',
                name: 'operation',
                type: 'options',
                options: [
                    {
                        name: 'True Random Number Generator',
                        value: 'trueRandom',
                        description: 'Gerador de número aleatório',
                    },
                ],
                default: 'trueRandom',
            },

            // min
            {
                displayName: 'Min',
                name: 'min',
                type: 'number',
                required: true,
                typeOptions: {
                    minValue: -1_000_000_000,
                    maxValue: 1_000_000_000,
                    numberPrecision: 0,
                },
                default: null,
                description: 'Valor minimo',
                displayOptions: {
                    show: {
                        operation: ['trueRandom'],
                    },
                },
            },

            // max
            {
                displayName: 'Max',
                name: 'max',
                type: 'number',
                required: true,
                typeOptions: {
                    minValue: -1_000_000_000,
                    maxValue: 1_000_000_000,
                    numberPrecision: 0,
                },
                default: null,
                description: 'Valor máximo',
                displayOptions: {
                    show: {
                        operation: ['trueRandom'],
                    },
                },
            },
        ],
    };

    async execute(this: IExecuteFunctions) {
        const min = this.getNodeParameter('min', 0) as number;
        const max = this.getNodeParameter('max', 0) as number;

        if (typeof min !== 'number' || typeof max !== 'number') {
            throw new Error('Min e Max devem ser números válidos');
        }

        if (min >= max) {
            throw new Error('Minimo deve ser menor que o maximo');
        }
        try {
            const response = await fetch('https://www.random.org/integers/?num=1&min=' + min + '&max=' + max + '&col=1&base=10&format=plain&rnd=new', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            })
            // format=plain retorna uma string com o número
            const data = await response.text();
            const randomNumber = parseInt(data, 10);
            return [this.helpers.returnJsonArray([{ randomNumber }])];
        } catch (error) {
            throw new Error('501');
        }

    }
}
