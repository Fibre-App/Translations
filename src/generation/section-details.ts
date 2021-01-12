export class SectionDetails {
  private _key: string = "";

  public get key(): string {
    return this._key;
  }

  public varName: string = "_";
  public interfaceName: string = "I";

  public text: string = "";
  public interfaceText: string = "";

  public add(value: string): void {
    if (!value) {
      throw new Error("No value given");
    }

    value = value.toLowerCase();
    value = (value.match(/([0-z]+)/g) ?? []).join("");

    this.addToKey(value);
    this.addToVarName(value);
    this.addToInterfaceName(value);
  }

  public copy(): SectionDetails {
    const clone: SectionDetails = Object.assign({}, this);
    Object.setPrototypeOf(clone, SectionDetails.prototype);

    return clone;
  }

  private addToKey(value: string): void {
    if (this._key.length > 0) {
      this._key += "-";
    }

    this._key += value;
  }

  private addToVarName(value: string): void {
    if (this.varName.length > 1) {
      this.varName += value.charAt(0).toUpperCase() + value.slice(1);
    } else {
      this.varName += value;
    }
  }

  private addToInterfaceName(value: string): void {
    this.interfaceName += value.charAt(0).toUpperCase() + value.slice(1);
  }
}
