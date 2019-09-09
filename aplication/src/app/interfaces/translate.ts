export interface Translate {
    key: string;
    ua: string;
    ru: string;
}

export class TranslateObj implements Translate {
    public key: string = '';
    public ua: string = '';
    public ru: string = '';
    constructor() {
        return {
            key: this.key,
            ua: this.ua,
            ru: this.ru
        };
    }
}
