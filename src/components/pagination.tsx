import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import { Button } from "./button";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  // Não renderizar paginação se houver apenas uma página
  if (totalPages <= 1) return null;

  // Função para gerar array de páginas a serem exibidas
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 5; // Número máximo de botões de página a mostrar

    if (totalPages <= maxPagesToShow) {
      // Se o total de páginas for menor que o máximo, mostrar todas
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // Sempre mostrar a primeira página
      pageNumbers.push(1);

      // Calcular páginas do meio
      let startPage = Math.max(2, currentPage - 1);
      let endPage = Math.min(totalPages - 1, currentPage + 1);

      // Ajustar se estiver próximo do início
      if (currentPage <= 3) {
        endPage = 4;
      }

      // Ajustar se estiver próximo do fim
      if (currentPage >= totalPages - 2) {
        startPage = totalPages - 3;
      }

      // Adicionar elipses no início se necessário
      if (startPage > 2) {
        pageNumbers.push('ellipsis-start');
      }

      // Adicionar páginas do meio
      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
      }

      // Adicionar elipses no fim se necessário
      if (endPage < totalPages - 1) {
        pageNumbers.push('ellipsis-end');
      }

      // Sempre mostrar a última página
      pageNumbers.push(totalPages);
    }

    return pageNumbers;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="flex items-center justify-center space-x-2 mt-6">
      <Button
        variant="outline"
        size="icon"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        aria-label="Página anterior"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      {pageNumbers.map((page, index) => {
        if (page === 'ellipsis-start' || page === 'ellipsis-end') {
          return (
            <Button
              key={`ellipsis-${index}`}
              variant="ghost"
              size="icon"
              disabled
              className="cursor-default"
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          );
        }

        return (
          <Button
            key={page}
            variant={currentPage === page ? "default" : "outline"}
            size="icon"
            onClick={() => onPageChange(page as number)}
            aria-label={`Ir para página ${page}`}
            aria-current={currentPage === page ? "page" : undefined}
          >
            {page}
          </Button>
        );
      })}

      <Button
        variant="outline"
        size="icon"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        aria-label="Próxima página"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}