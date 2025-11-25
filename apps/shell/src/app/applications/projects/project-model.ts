export interface IProject {
  id: any;
  name: string;
  projectType: 'Internal' | 'Client' | 'Archived';
  imageUrl: string;
}
