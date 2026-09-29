import { Injectable } from '@nestjs/common';
import { PurchasesService } from '../purchases/purchases.service';
import { CreateSaleDto } from './dto/create-sale.dto';
import { UpdateSaleDto } from './dto/update-sale.dto';
import { SaleQueryDto } from './dto/sale-query.dto';

/**
 * Sales is the seller-facing name for the existing Purchase domain.
 * We intentionally reuse PurchasesService so Contacts, Products,
 * Services and Follow-ups continue using the same database records.
 */
@Injectable()
export class SalesService {
  constructor(private readonly purchasesService: PurchasesService) {}

  async create(dto: CreateSaleDto) {
    return this.purchasesService.create({
      contactId: dto.contactId,
      purchaseDate: dto.saleDate,
      items: dto.items,
      discount: dto.discount,
      notes: dto.notes,
    });
  }

  async findAll(query: SaleQueryDto) {
    return this.purchasesService.findAll({
      contactId: query.contactId,
      search: query.search,
      date: query.date,
      page: query.page,
      limit: query.limit,
    });
  }

  async findById(id: string) {
    return this.purchasesService.findById(id);
  }

  async update(id: string, dto: UpdateSaleDto) {
    return this.purchasesService.update(id, {
      status: dto.status,
      purchaseDate: dto.saleDate,
      notes: dto.notes,
    });
  }

  async remove(id: string) {
    return this.purchasesService.remove(id);
  }
}
