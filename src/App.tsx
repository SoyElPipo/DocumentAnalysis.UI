import { Admin, Resource, List, Datagrid, TextField, EditButton, ShowButton, EditGuesser, ShowGuesser, Create, SimpleForm, TextInput, FileInput, FileField, Edit } from 'react-admin';
import type { Accept } from 'react-dropzone';
import simpleRestProvider from 'ra-data-simple-rest';

const apiUrl = 'http://localhost:5000';

const baseProvider = simpleRestProvider(apiUrl);

const customDataProvider = {
  ...baseProvider,
  create: async (resource: string, params: any) => {
    if (resource === 'candidates') {
      const formData = new FormData();
      formData.append('name', params.data.name);
      formData.append('email', params.data.email);
      if (params.data.cv && params.data.cv.rawFile) {
        formData.append('cv', params.data.cv.rawFile, params.data.cv.rawFile.name);
      }
      const response = await fetch(`${apiUrl}/${resource}`, {
        method: 'POST',
        body: formData,
      });
      const json = await response.json();
      return { data: json };
    }
    return baseProvider.create(resource, params);
  },
  update: async (resource: string, params: any) => {
    if (resource === 'candidates') {
      const formData = new FormData();
      if (params.data.name) formData.append('name', params.data.name);
      if (params.data.email) formData.append('email', params.data.email);
      if (params.data.cv && params.data.cv.rawFile) {
        formData.append('cv', params.data.cv.rawFile, params.data.cv.rawFile.name);
      }
      const response = await fetch(`${apiUrl}/${resource}/${params.id}`, {
        method: 'PUT',
        body: formData,
      });
      const json = await response.json();
      return { data: json };
    }
    return baseProvider.update(resource, params);
  },
};

const CandidateList = (props: any) => (
  <List {...props}>
    <Datagrid>
      <TextField source="id" />
      <TextField source="name" />
      <TextField source="email" />
      <EditButton />
      <ShowButton />
    </Datagrid>
  </List>
);

const CandidateEdit = (props: any) => (
  <Edit {...props}>
    <SimpleForm>
      <TextInput source="name" required />
      <TextInput source="email" required />
      <FileInput source="cv" label="CV" accept={fileAccept}>
        <FileField source="src" title="title" />
      </FileInput>
    </SimpleForm>
  </Edit>
);

const CandidateShow = ShowGuesser;

const fileAccept: Accept = {
  'application/pdf': ['.pdf'],
  'application/msword': ['.doc'],
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
};

const CandidateCreate = (props: any) => (
  <Create {...props}>
    <SimpleForm>
      <TextInput source="name" required />
      <TextInput source="email" required />
      <FileInput source="cv" label="CV" accept={fileAccept} isRequired>
        <FileField source="src" title="title" />
      </FileInput>
    </SimpleForm>
  </Create>
);

export default function App() {
  return (
    <Admin dataProvider={customDataProvider}>
      <Resource
        name="candidates"
        list={CandidateList}
        edit={CandidateEdit}
        show={CandidateShow}
        create={CandidateCreate}
      />
    </Admin>
  );
}
