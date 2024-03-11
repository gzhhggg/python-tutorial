import {
  DatagridConfigurable,
  DateField,
  List,
  SearchInput,
  TextField,
  TopToolbar,
  SelectColumnsButton,
  FilterButton,
  CreateButton,
  ExportButton,
  Pagination,
  Create,
  SimpleForm,
  Edit,
  TextInput,
  EmailField,
  ReferenceField,
} from "react-admin";

const MemberPagination = () => (
  <Pagination rowsPerPageOptions={[10, 25, 50, 100]} />
);

const ListActions = () => (
  <TopToolbar>
    <SelectColumnsButton />
    <FilterButton />
    <CreateButton />
    <ExportButton />
  </TopToolbar>
);

const MemberFilters = [
  <SearchInput source="q" alwaysOn />,
];

export const MemberList = () => (
  <List
    actions={<ListActions />}
    filters={MemberFilters}
    pagination={<MemberPagination />}
  >
    <DatagridConfigurable rowClick="edit">
      <TextField source="id" />
      <ReferenceField source="client_id" reference="clients"/>
      <TextField source="name" />
      <EmailField source="email" />
      <TextField source="phone" />
      <DateField source="created_at" />
      <DateField source="deleted_at" />
    </DatagridConfigurable>
  </List>
);

export const MemberEdit = () => (
  <Edit>
    <SimpleForm>
      <TextInput source="name" />
    </SimpleForm>
  </Edit>
);

export const MemberCreate = () => (
  <Create>
    <SimpleForm>
      <TextInput source="name" />
    </SimpleForm>
  </Create>
);