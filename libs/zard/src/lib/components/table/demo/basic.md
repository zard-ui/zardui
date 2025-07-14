**Basic usage**

This example shows how to use the table component without pagination, sorting, or filtering — just a simple list of data.

You only need to provide the column definitions and a data source.  
The table will render the data in the order it's provided.

To bind the data, use the `[dataSource]` input and pass an object that contains a `data` array.


```ts
interface ZardTableDataSource<T> {
  data: T[];
}
```
