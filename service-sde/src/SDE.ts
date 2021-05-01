import fs from 'fs';
import YAML from 'yaml';

export interface SDEMaterialType
{
	materials: MaterialType[];
}

export interface SDEBlueprintType
{
	blueprints: BlueprintType[];
}

export interface MaterialType
{
	materialTypeID: number;
	quantity: number;
}

export interface ProductionMaterialType
{
	typeID: number;
	name: string;
	quantity: number;
}

export interface BlueprintType
{
	input: [ProductionMaterialType];
	output: ProductionMaterialType;
	isResearchable: boolean;
	efficiency: number;
}

export class SDE
{
    private static instance: SDE;
    materials = new Map<string, MaterialType[]>();
	blueprints = new Map<string, BlueprintType>();
	blueprintOutputMap = new Map<string, string>();

    constructor()
    {
        if (SDE.instance) {
            return SDE.instance;
        }
		// Load materials
        let materials = YAML.parse(
            fs.readFileSync('./sde/fsd/typeMaterials.yaml', {encoding: 'utf8'})
			  .toString()
        );
        Object.keys(materials).map((id) =>
            this.materials.set(
				id.toString(),
				(<SDEMaterialType>materials[id]).materials
			)
        );
		// Load blueprints
		let blueprints = JSON.parse(
            fs.readFileSync('./sde.json', {encoding: 'utf8'})
			  .toString()
        );
		Object.keys(blueprints).map((id) =>
            this.blueprints.set(
				id.toString(),
				<BlueprintType>blueprints[id]
			)
        );
		for (let [key , value] of this.blueprints) {
			this.blueprintOutputMap.set(value.output.typeID.toString(), key);
		}
        SDE.instance = this;
    }

	public getMaterials(typeId: string): MaterialType[]
	{
		return <MaterialType[]>this.materials.get(typeId)
	}

	public findBlueprints(name: string): BlueprintType[]
	{
		let result: BlueprintType[] = [];
		for (let [key , value] of this.blueprints) {
			if ((typeof(value.output.name) !== 'undefined') && (value.output.name.toLowerCase().indexOf(name.toLowerCase()) >= 0)) {
				result.push(value);
			}
		}
		return result;
	}

	public getBlueprint(typeId: string): BlueprintType
	{
		let key = this.blueprintOutputMap.get(typeId);
		if (key) {
			return <BlueprintType>this.blueprints.get(key);
		}
		throw new Error("Type not found.");
	}
}
