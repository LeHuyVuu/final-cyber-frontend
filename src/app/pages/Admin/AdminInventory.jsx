import React, { useEffect, useState, useRef, useCallback } from 'react';
import axios from 'axios';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { Dialog } from 'primereact/dialog';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import debounce from 'lodash.debounce';
import API_BASE_URL from '../../apiConfig';

const token = localStorage.getItem("token");

export default function AdminInventory() {
  const toast = useRef(null);
  const editBuffer = useRef({});
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [editDialogVisible, setEditDialogVisible] = useState(false);
  const [pagination, setPagination] = useState({ page: 1, pageSize: 10 });
  const [searchTerm, setSearchTerm] = useState('');
  const [stockFilter, setStockFilter] = useState('all');
  const [priceSortOrder, setPriceSortOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(false); // ✅ Skeleton loading state

  const debouncedFetch = useRef(
    debounce((page, pageSize, sTerm, sFilter, pSort) => {
      fetchProducts(page, pageSize, sTerm, sFilter, pSort);
    }, 500)
  ).current;

  const fetchProducts = useCallback(async (page, pageSize, sTerm = '', sFilter = 'all', pSort = null) => {
    try {
      setIsLoading(true);
      const params = {
        page,
        pageSize,
        sortBy: pSort === 'asc' || pSort === 'desc' ? 'price' : 'productid',
        sortOrder: pSort || 'asc'
      };
      if (sFilter === 'instock') params.stockFilter = 'instock';

      const res = await axios.get(`${API_BASE_URL}/api/Products`, {
        params,
        headers: { Authorization: `Bearer ${token}` }
      });

      const data = res.data?.data;
      setProducts(data?.products || []);
    } catch (err) {
      toast.current?.show({ severity: 'error', summary: 'Lỗi', detail: 'Không thể tải sản phẩm' });
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    debouncedFetch(pagination.page, pagination.pageSize, '', stockFilter, priceSortOrder);
  }, [pagination.page, pagination.pageSize, stockFilter, priceSortOrder, debouncedFetch]);

  const onSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const onStockFilterChange = (e) => {
    setStockFilter(e.value);
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const onPriceSortChange = (e) => {
    setPriceSortOrder(e.value);
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handleEdit = useCallback((product) => {
    setEditingProduct(product);
    editBuffer.current = {};
    setEditDialogVisible(true);
  }, []);

  const handleSaveEdit = async () => {
    try {
      const updated = {
        productid: editingProduct.productid,
        productname: editBuffer.current.productname ?? editingProduct.productname,
        image: editBuffer.current.image ?? editingProduct.image,
        brand: editBuffer.current.brand ?? editingProduct.brand,
        sku: editBuffer.current.sku ?? editingProduct.sku,
        price: editBuffer.current.price ?? editingProduct.price,
        discount_price: editBuffer.current.discount_price ?? editingProduct.discount_price,
        stock_quantity: editBuffer.current.stock_quantity ?? editingProduct.stock_quantity
      };

      await axios.put(`${API_BASE_URL}/api/Products/${editingProduct.productid}`, updated, {
        headers: { Authorization: `Bearer ${token}` }
      });

      toast.current?.show({ severity: "success", summary: "Cập nhật", detail: "Cập nhật sản phẩm thành công" });

      setEditDialogVisible(false);
      editBuffer.current = {};
      fetchProducts(pagination.page, pagination.pageSize, '', stockFilter, priceSortOrder);
    } catch {
      toast.current?.show({ severity: "error", summary: "Lỗi", detail: "Cập nhật thất bại" });
    }
  };

  const handleDelete = useCallback((product) => {
    confirmDialog({
      message: `Xác nhận xoá sản phẩm "${product.productname}"?`,
      header: 'Xoá sản phẩm',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Xoá',
      rejectLabel: 'Huỷ',
      accept: async () => {
        try {
          await axios.delete(`${API_BASE_URL}/api/Products/${product.productid}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          toast.current?.show({ severity: 'success', summary: 'Đã xoá', detail: 'Sản phẩm đã được xoá' });

          const remaining = products.length - 1;
          const nextPage = (remaining === 0 && pagination.page > 1) ? pagination.page - 1 : pagination.page;
          setPagination(prev => ({ ...prev, page: nextPage }));
          fetchProducts(nextPage, pagination.pageSize, '', stockFilter, priceSortOrder);
        } catch {
          toast.current?.show({ severity: 'error', summary: 'Lỗi', detail: 'Không thể xoá sản phẩm' });
        }
      }
    });
  }, [products.length, pagination.page, pagination.pageSize, fetchProducts, stockFilter, priceSortOrder]);

  const imageTemplate = useCallback((rowData) => (
    <img src={rowData.image} alt={rowData.productname} className="w-16 h-16 object-cover rounded shadow" />
  ), []);

  const priceTemplate = useCallback((rowData) => (
    <span>{rowData.price?.toLocaleString('vi-VN')} VNĐ</span>
  ), []);

  const actionTemplate = useCallback((rowData) => (
    <div className="flex gap-2">
      <Button icon="pi pi-pencil" className="p-button-rounded p-button-info" onClick={() => handleEdit(rowData)} />
      <Button icon="pi pi-trash" className="p-button-rounded p-button-danger" onClick={() => handleDelete(rowData)} />
    </div>
  ), [handleEdit, handleDelete]);

  const filteredProducts = products.filter((p) =>
    p.productname?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const paginatedProducts = filteredProducts.slice(
    (pagination.page - 1) * pagination.pageSize,
    pagination.page * pagination.pageSize
  );

  return (
    <div className="p-6">
      <Toast ref={toast} />
      <ConfirmDialog />
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Quản lý sản phẩm</h2>

      <div className="flex gap-4 mb-4 items-center">
        <div className="relative flex-grow max-w-sm">
          <i className="pi pi-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <InputText
            value={searchTerm}
            onChange={onSearchChange}
            placeholder="Tìm theo tên sản phẩm..."
            className="pl-10 w-full border rounded-md py-2"
          />
        </div>

        <Dropdown
          value={stockFilter}
          options={[
            { label: 'Tất cả sản phẩm', value: 'all' },
            { label: 'Chỉ sản phẩm còn hàng', value: 'instock' }
          ]}
          onChange={onStockFilterChange}
          placeholder="Kho hàng"
          className="w-48"
        />

        <Dropdown
          value={priceSortOrder}
          options={[
            { label: 'Sắp xếp giá: Mặc định', value: null },
            { label: 'Giá tăng dần', value: 'asc' },
            { label: 'Giá giảm dần', value: 'desc' }
          ]}
          onChange={onPriceSortChange}
          placeholder="Sắp xếp giá"
          className="w-48"
        />
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-4">
          {[...Array(6)].map((_, index) => (
            <div key={index} className="shadow rounded p-4 bg-white space-y-2 animate-pulse">
              <div className="h-16 w-16 bg-gray-200 rounded" />
              <div className="h-4 bg-gray-200 rounded w-3/4" />
              <div className="h-4 bg-gray-200 rounded w-1/2" />
              <div className="h-4 bg-gray-200 rounded w-2/3" />
            </div>
          ))}
        </div>
      ) : (
        <DataTable
          value={paginatedProducts}
          key="productid"
          paginator
          rows={pagination.pageSize}
          totalRecords={filteredProducts.length}
          lazy
          first={(pagination.page - 1) * pagination.pageSize}
          onPage={(e) => setPagination(prev => ({ ...prev, page: e.page + 1, pageSize: e.rows }))}
          className="shadow rounded bg-white"
          tableStyle={{ minWidth: '60rem' }}
        >
          <Column field="productid" header="ID" sortable />
          <Column field="productname" header="Tên sản phẩm" sortable />
          <Column header="Hình ảnh" body={imageTemplate} />
          <Column field="brand" header="Thương hiệu" />
          <Column field="sku" header="Mã SKU" />
          <Column field="price" header="Giá" body={priceTemplate} sortable />
          <Column field="discount_price" header="Giá giảm" body={priceTemplate} />
          <Column field="stock_quantity" header="Kho" />
          <Column header="Thao tác" body={actionTemplate} />
        </DataTable>
      )}

      <Dialog
        header="Cập nhật sản phẩm"
        visible={editDialogVisible}
        style={{ width: '400px' }}
        modal
        onHide={() => {
          editBuffer.current = {};
          setEditDialogVisible(false);
        }}
      >
        <div className="p-fluid space-y-4">
          {[
            { label: "Tên sản phẩm", key: "productname" },
            { label: "Giá", key: "price", type: "number" },
            { label: "Giá giảm", key: "discount_price", type: "number" },
            { label: "Số lượng kho", key: "stock_quantity", type: "number" },
            { label: "Hình ảnh (URL)", key: "image" },
            { label: "Thương hiệu", key: "brand" },
            { label: "Mã SKU", key: "sku" }
          ].map(({ label, key, type = "text" }) => (
            <div key={key}>
              <label>{label}</label>
              <InputText
                type={type}
                defaultValue={editingProduct?.[key] ?? ""}
                onChange={(e) => {
                  const value = e.target.value;
                  editBuffer.current[key] = type === "number" ? parseFloat(value) : value;
                }}
              />
            </div>
          ))}
        </div>

        <div className="flex justify-end mt-4 gap-2">
          <Button label="Huỷ" icon="pi pi-times" className="p-button-text" onClick={() => setEditDialogVisible(false)} />
          <Button label="Lưu" icon="pi pi-check" onClick={handleSaveEdit} />
        </div>
      </Dialog>
    </div>
  );
}
