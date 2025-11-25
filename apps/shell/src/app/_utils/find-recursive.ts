type TreeNode<T = object> = T & {
  children?: TreeNode<T>[];
};

export default function findRecursive<T extends object>(
  items: TreeNode<T>[],
  predicate: (item: TreeNode<T>) => boolean
): TreeNode<T> | undefined {
  for (const item of items) {
    if (predicate(item)) {
      return item;
    }

    if (item.children && item.children.length > 0) {
      const foundInChildren = findRecursive(item.children, predicate);
      if (foundInChildren) {
        return foundInChildren;
      }
    }
  }
  return undefined;
}
