import { TreeDataSource } from 'src/app/freamwork/util/tree/tree-datasource';
import { FunctionModel } from 'src/app/routes/system-management/auth/entity/function-model';

export interface Tree {
  fillInChildren(datasource: TreeDataSource[]): void;
}

export function buildTree<T extends Tree>(datasource: TreeDataSource[], factory: (v: FunctionModel) => T) {
  const treeList: T[] = [];
  if (datasource && datasource.length > 0) {
    datasource.forEach(item => {
      const instance: FunctionModel = new FunctionModel(item);
      if (instance.isTopNode) {
        let tree: T = factory(instance);
        tree.fillInChildren(datasource);
        treeList.push(tree);
      }
    });
  }
  return treeList;
}
