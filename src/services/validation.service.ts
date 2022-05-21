import { CreateWorkItemDto } from '@/dtos/workItems.dto';
import { HttpException } from '@exceptions/HttpException';
// import { CreateManufactureRecordDto, UpdateManufactureRecordDto } from '@/dtos/manufactureRecords.dto';
// import { CreateManufactureDto, UpdateManufactureDto } from '@/dtos/manufactures.dto';
// import { CreateProductDto, UpdateProductDto } from '@/dtos/products.dto';
// import { CreateOrderDto, UpdateOrderDto } from '@/dtos/orders.dto';
// import { ManufactureRecord } from '@/interfaces/manufactureRecords.interface';
// import { Manufacture } from '@/interfaces/manufactures.interface';
// import MaterialService from './materials.service';
// import ProcessService from './processes.service';
// import ProductService from './products.service';

// interface validateManufactureRecordArgs {
//   oldManufactureRecord?: ManufactureRecord;
//   newManufactureRecord: CreateManufactureRecordDto | UpdateManufactureRecordDto;
//   manufacture: Manufacture;
// }

class ValidationService {
  public static async validateWorkItem(workItemData: CreateWorkItemDto): Promise<void> {
    //No need validation at the moment
  }

  // public static async validateProduct(productData: CreateProductDto | UpdateProductDto): Promise<void> {
  //   const materialService = new MaterialService();
  //   const processService = new ProcessService();

  //   const { materials, processes } = productData;
  //   let errorMessage = '';
  //   let materialValidationPromises = [];
  //   let processValidationPromises = [];

  //   if (materials) {
  //     materialValidationPromises = materials.map(async material => {
  //       if (!(await materialService.materialExists(material.materialId))) {
  //         errorMessage = `Material '${material.materialId}' not found`;
  //       }
  //     });
  //   }

  //   if (processes) {
  //     processValidationPromises = processes.map(async process => {
  //       if (!(await processService.processExists(process.processId))) {
  //         errorMessage = `Process '${process.processId}' not found`;
  //       }
  //     });
  //   }

  //   await Promise.all([...materialValidationPromises, ...processValidationPromises]);
  //   if (errorMessage) throw new HttpException(400, errorMessage);
  // }

  // public static async validateOrder(orderData: CreateOrderDto | UpdateOrderDto): Promise<void> {
  //   const productService = new ProductService();
  //   const { products } = orderData;
  //   let errorMessage = '';
  //   let productValidationPromises = [];

  //   if (products) {
  //     productValidationPromises = products.map(async product => {
  //       if (!(await productService.productExists(product.productId))) {
  //         errorMessage = `Product '${product.productId}' not found`;
  //       }
  //     });
  //   }

  //   await Promise.all(productValidationPromises);
  //   if (errorMessage) throw new HttpException(400, errorMessage);
  // }

  // public static async validateManufacture(manufactureData: CreateManufactureDto | UpdateManufactureDto): Promise<void> {
  //   const materialService = new MaterialService();
  //   const processService = new ProcessService();
  //   const productService = new ProductService();

  //   const { products, materials, processes } = manufactureData;
  //   let errorMessage = '';
  //   let productValidationPromises = [];
  //   let materialValidationPromises = [];
  //   let processValidationPromises = [];

  //   if (products) {
  //     productValidationPromises = products.map(async product => {
  //       const productId = typeof product === 'string' ? product : product._id.toString();
  //       if (!(await productService.productExists(productId))) {
  //         errorMessage = `Product '${productId}' not found`;
  //       }
  //     });
  //   }

  //   if (materials) {
  //     materialValidationPromises = materials.map(async material => {
  //       const materialId = material.materialId ?? material._id.toString();
  //       if (!(await materialService.materialExists(materialId))) {
  //         errorMessage = `Material '${materialId}' not found`;
  //       }
  //     });
  //   }

  //   if (processes) {
  //     processValidationPromises = processes.map(async process => {
  //       const processId = process.processId ?? process._id.toString();
  //       if (!(await processService.processExists(processId))) {
  //         errorMessage = `Process '${processId}' not found`;
  //       }
  //     });
  //   }

  //   await Promise.all([...productValidationPromises, ...materialValidationPromises, ...processValidationPromises]);
  //   if (errorMessage) throw new HttpException(400, errorMessage);
  // }

  // public static async validateManufactureRecord(validationArgs: validateManufactureRecordArgs): Promise<void> {
  //   const { oldManufactureRecord, newManufactureRecord, manufacture } = validationArgs;
  //   const { materials: addingMaterials, processes: addingProcesses } = newManufactureRecord;

  //   if (addingMaterials) {
  //     addingMaterials.map(addingMaterial => {
  //       const existingMaterial = manufacture.materials.find(
  //         m => m._id.toString() === addingMaterial.materialId && m.productId === addingMaterial.productId,
  //       );
  //       const subtractingMaterial = oldManufactureRecord
  //         ? oldManufactureRecord.materials.find(
  //             m => m.materialId.toString() === addingMaterial.materialId && m.productId === addingMaterial.productId,
  //           )
  //         : null;

  //       const quantityFinished =
  //         existingMaterial.quantityFinished + addingMaterial.quantityFinished - (subtractingMaterial ? subtractingMaterial.quantityFinished : 0);

  //       if (quantityFinished > existingMaterial.quantityTotal) {
  //         throw new HttpException(409, `Material '${addingMaterial.materialId}' in product '${addingMaterial.productId}' exists its quantity`);
  //       }
  //     });
  //   }

  //   if (addingProcesses) {
  //     addingProcesses.map(addingProcess => {
  //       const existingProcess = manufacture.processes.find(
  //         p => p._id.toString() === addingProcess.processId && p.productId === addingProcess.productId,
  //       );
  //       const subtractingProcess = oldManufactureRecord
  //         ? oldManufactureRecord.processes.find(p => p.processId.toString() === addingProcess.processId && p.productId === addingProcess.productId)
  //         : null;

  //       const quantityFinished =
  //         existingProcess.quantityFinished + addingProcess.quantityFinished - (subtractingProcess ? subtractingProcess.quantityFinished : 0);

  //       if (quantityFinished > existingProcess.quantityTotal) {
  //         throw new HttpException(409, `Process '${addingProcess.processId}' in product '${addingProcess.productId}' exists its quantity`);
  //       }
  //     });
  //   }
  // }
}

export default ValidationService;
