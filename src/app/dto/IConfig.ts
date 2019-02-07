export interface IRow  {
    visible: boolean;
    size: number;
    type: string;
    template?: any;
}

export interface IColumn {
    visible: boolean;
    size: number;
    rows: Array<IRow>;
}
export interface IConfig {
    columns: Array<IColumn>;
    disabled: boolean;
}


export const defaultConfig: IConfig = {
    columns: [
        {
            visible: true,
            size: 25,
            rows: [
                { visible: true, size: 25, type: 'canvasTemplate' },
                { visible: true, size: 75, type: 'B' }
            ]
        },
        {
            visible: true,
            size: 50,
            rows: [
                { visible: true, size: 60, type: 'devTemplate' },
                { visible: true, size: 40, type: 'C' }
            ]
        },
        {
            visible: true,
            size: 25,
            rows: [
                { visible: true, size: 20, type: 'D' },
                { visible: true, size: 30, type: 'E' },
                { visible: true, size: 50, type: 'F' }
            ]
        }
    ],
    disabled: false
};
