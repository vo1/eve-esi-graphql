import fs from 'fs';
import YAML from 'yaml';

export interface SDEMaterialType
{
	materials: MaterialType[];
}

export interface MaterialType
{
	materialTypeID: number;
	quantity: number;
}

export class SDE
{
    private static instance: SDE;
    materials = new Map<string, MaterialType[]>();

    constructor()
    {
        if (SDE.instance) {
            return SDE.instance;
        }
        let materials = YAML.parse(
            fs.readFileSync('./sde/fsd/typeMaterials.yaml', {encoding: 'utf8'}).toString()
        );
        Object.keys(materials).map((id) =>
            (this.materials.set(id.toString(), (<SDEMaterialType>materials[id]).materials))
        );
        SDE.instance = this;
    }

	public getMaterials(typeId: string): MaterialType[]
	{
		return <MaterialType[]>this.materials.get(typeId)
	}
}
