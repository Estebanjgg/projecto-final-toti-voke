const Joi = require('joi');
const { v4: uuidv4 } = require('uuid');

// Esquema de validación para productos
const productSchema = Joi.object({
  id: Joi.string().optional(),
  title: Joi.string().min(3).max(200).required(),
  brand: Joi.string().min(2).max(50).required(),
  category: Joi.string().valid(
    'Smartphone', 'Tablet', 'Notebook', 'Desktop', 'Monitor', 
    'Acessórios', 'Gaming', 'Audio', 'Câmeras'
  ).required(),
  originalPrice: Joi.number().positive().required(),
  currentPrice: Joi.number().positive().required(),
  discount: Joi.number().min(0).max(100).optional(),
  installments: Joi.object({
    times: Joi.string().required(),
    value: Joi.string().required()
  }).optional(),
  image: Joi.string().uri().optional(),
  images: Joi.array().items(Joi.string().uri()).optional(),
  description: Joi.string().max(1000).optional(),
  specifications: Joi.object().optional(),
  stock: Joi.number().integer().min(0).default(0),
  isActive: Joi.boolean().default(true),
  isFeatured: Joi.boolean().default(false),
  isOffer: Joi.boolean().default(false),
  isBestSeller: Joi.boolean().default(false),
  tags: Joi.array().items(Joi.string()).optional(),
  weight: Joi.number().positive().optional(),
  dimensions: Joi.object({
    length: Joi.number().positive(),
    width: Joi.number().positive(),
    height: Joi.number().positive()
  }).optional(),
  warranty: Joi.string().optional(),
  condition: Joi.string().valid('Novo', 'Seminovo', 'Usado', 'Recondicionado').default('Seminovo'),
  createdAt: Joi.date().optional(),
  updatedAt: Joi.date().optional()
});

class Product {
  constructor(data) {
    const { error, value } = productSchema.validate(data);
    if (error) {
      throw new Error(`Datos de producto inválidos: ${error.details[0].message}`);
    }
    
    this.id = value.id || uuidv4();
    this.title = value.title;
    this.brand = value.brand;
    this.category = value.category;
    this.originalPrice = value.originalPrice;
    this.currentPrice = value.currentPrice;
    this.discount = value.discount || this.calculateDiscount();
    this.installments = value.installments || this.calculateInstallments();
    this.image = value.image || '/api/placeholder/200/200';
    this.images = value.images || [this.image];
    this.description = value.description || '';
    this.specifications = value.specifications || {};
    this.stock = value.stock;
    this.isActive = value.isActive;
    this.isFeatured = value.isFeatured;
    this.isOffer = value.isOffer;
    this.isBestSeller = value.isBestSeller;
    this.tags = value.tags || [];
    this.weight = value.weight;
    this.dimensions = value.dimensions;
    this.warranty = value.warranty || '90 días';
    this.condition = value.condition;
    this.createdAt = value.createdAt || new Date();
    this.updatedAt = value.updatedAt || new Date();
  }

  // Calcular descuento automáticamente
  calculateDiscount() {
    if (this.originalPrice && this.currentPrice) {
      return Math.round(((this.originalPrice - this.currentPrice) / this.originalPrice) * 100);
    }
    return 0;
  }

  // Calcular cuotas automáticamente
  calculateInstallments(times = 10) {
    const installmentValue = (this.currentPrice / times).toFixed(2);
    return {
      times: `${times}x`,
      value: installmentValue.replace('.', ',')
    };
  }

  // Actualizar producto
  update(data) {
    const { error, value } = productSchema.validate({ ...this.toJSON(), ...data });
    if (error) {
      throw new Error(`Datos de actualización inválidos: ${error.details[0].message}`);
    }
    
    Object.assign(this, value);
    this.updatedAt = new Date();
    
    // Recalcular descuento si cambió el precio
    if (data.originalPrice || data.currentPrice) {
      this.discount = this.calculateDiscount();
      this.installments = this.calculateInstallments();
    }
    
    return this;
  }

  // Convertir a JSON
  toJSON() {
    return {
      id: this.id,
      title: this.title,
      brand: this.brand,
      category: this.category,
      originalPrice: this.originalPrice,
      currentPrice: this.currentPrice,
      discount: this.discount,
      installments: this.installments,
      image: this.image,
      images: this.images,
      description: this.description,
      specifications: this.specifications,
      stock: this.stock,
      isActive: this.isActive,
      isFeatured: this.isFeatured,
      isOffer: this.isOffer,
      isBestSeller: this.isBestSeller,
      tags: this.tags,
      weight: this.weight,
      dimensions: this.dimensions,
      warranty: this.warranty,
      condition: this.condition,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }

  // Validar datos de producto
  static validate(data) {
    return productSchema.validate(data);
  }

  // Obtener categorías disponibles
  static getCategories() {
    return [
      'Smartphone', 'Tablet', 'Notebook', 'Desktop', 'Monitor',
      'Acessórios', 'Gaming', 'Audio', 'Câmeras'
    ];
  }

  // Obtener condiciones disponibles
  static getConditions() {
    return ['Novo', 'Seminovo', 'Usado', 'Recondicionado'];
  }
}

module.exports = Product;