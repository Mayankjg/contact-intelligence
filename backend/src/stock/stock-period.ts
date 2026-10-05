import { BadRequestException } from '@nestjs/common';
import { Prisma } from '@prisma/client';

export async function ensureStockPeriodOpen(
  tx: Prisma.TransactionClient,
  date: Date,
) {
  const closed = await tx.stockClosure.findFirst({
    where: { startDate: { lte: date }, endDate: { gte: date } },
    select: { id: true },
  });
  if (closed) {
    throw new BadRequestException(
      'This stock date belongs to a closed period. Reopen the next period or use an open date.',
    );
  }
}
