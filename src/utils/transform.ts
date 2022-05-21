// import { Manufacture, ManufactureMaterial, ManufactureProcess, ManufactureProduct } from '@/interfaces/manufactures.interface';
import { User } from '@/interfaces/users.interface';
import { WorkItem } from '@/interfaces/workItems.interface';
// import { CreateManufactureDto, UpdateManufactureDto } from '@/dtos/manufactures.dto';
// import MaterialService from '@/services/materials.service';
// import ProcessService from '@/services/processes.service';
// import ProductService from '@/services/products.service';

export const convertCamelToUnderScore = text => {
  return text
    .split(/(?=[A-Z])/)
    .join('_')
    .toLowerCase();
};

export const transformUsers = (users: User[]): Partial<User>[] => {
  return users.map(user => transformUser(user));
};

export const transformUser = (user: User): Partial<User> => {
  return {
    _id: user._id,
    email: user.email,
  };
};

export const mergeUpdate = <E>(existing: E, update: Partial<E>): Partial<E> => {
  return { ...existing, ...update };
};

// export const populateCreateManufacture = async (manufactureData: CreateManufactureDto): Promise<Manufacture> => {
//   const productService = new ProductService();
//   const materialService = new MaterialService();
//   const processService = new ProcessService();

//   let manufactureProduct: ManufactureProduct[] = [];
//   let manufactureMaterial: ManufactureMaterial[] = [];
//   let manufactureProcess: ManufactureProcess[] = [];

//   const { products, materials, processes } = manufactureData;

//   if (products) {
//     const productPromises = products.map(async productId => {
//       return {
//         ...(await productService.findProductById(productId)),
//       };
//     });

//     manufactureProduct = await Promise.all(productPromises);
//   }

//   if (materials) {
//     const materialPromises = materials.map(async material => {
//       return {
//         productId: material.productId,
//         quantityTotal: material.quantityTotal,
//         quantityFinished: material.quantityFinished,
//         ...(await materialService.findMaterialById(material.materialId)),
//       };
//     });

//     manufactureMaterial = await Promise.all(materialPromises);
//   }

//   if (processes) {
//     const processPromises = processes.map(async process => {
//       return {
//         productId: process.productId,
//         quantityTotal: process.quantityTotal,
//         quantityFinished: process.quantityFinished,
//         ...(await processService.findProcessById(process.processId)),
//       };
//     });

//     manufactureProcess = await Promise.all(processPromises);
//   }

//   return {
//     ...manufactureData,
//     products: manufactureProduct,
//     materials: manufactureMaterial,
//     processes: manufactureProcess,
//   };
// };

// export const populateUpdateManufacture = (existing: Manufacture, update: UpdateManufactureDto): Partial<Manufacture> => {
//   return {
//     ...existing,
//     ...{
//       ...update,
//       products: update.products.map(p => {
//         return { ...p, createdAt: new Date(p.createdAt), updatedAt: new Date(p.updatedAt) };
//       }),
//       materials: update.materials.map(m => {
//         return { ...m, createdAt: new Date(m.createdAt), updatedAt: new Date(m.updatedAt) };
//       }),
//       processes: update.processes.map(p => {
//         return { ...p, createdAt: new Date(p.createdAt), updatedAt: new Date(p.updatedAt) };
//       }),
//     },
//   };
// };
