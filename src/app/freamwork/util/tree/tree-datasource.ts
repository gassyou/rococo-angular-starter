export abstract class TreeDataSource {
  public id!: number;
  public parentId!: number | null | undefined;
  public childCount!: number;

  constructor(value: any) {
    Object.assign(this, value);
  }

  get isLeaf(): boolean {
    return this.childCount && this.childCount > 0 ? false : true;
  }

  get isTopNode(): boolean {
    return !this.parentId || this.parentId === 0 ? true : false;
  }
}
