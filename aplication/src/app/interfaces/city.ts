export interface City {
	name: string;
	img: string;
}

export class CityObj implements City {
	public name: string = '';
	public img: string = '';
	constructor() {
		return {
			name: this.name,
			img: this.img
		};
	}
}
