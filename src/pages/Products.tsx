import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { Search, Plus, Edit, Trash2, X, Check, Package } from 'lucide-react';
import { formatCurrency } from '../lib/utils';

interface ProductData {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  created_at: string;
}

function Products() {
  const [products, setProducts] = useState<ProductData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<ProductData | null>(null);
  
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) {
        throw error;
      }
      
      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
      
      // For demo purposes, set some sample products
      setProducts([
        {
          id: '1',
          name: 'Ergonomic Desk Chair',
          description: 'Comfortable office chair with lumbar support',
          price: 249.99,
          stock: 15,
          created_at: '2023-01-10T00:00:00Z',
        },
        {
          id: '2',
          name: 'Wireless Keyboard',
          description: 'Bluetooth keyboard with mechanical switches',
          price: 89.99,
          stock: 32,
          created_at: '2023-02-05T00:00:00Z',
        },
        {
          id: '3',
          name: 'Ultra-Wide Monitor',
          description: '34-inch curved display for productivity',
          price: 499.99,
          stock: 8,
          created_at: '2023-03-12T00:00:00Z',
        },
        {
          id: '4',
          name: 'Noise-Cancelling Headphones',
          description: 'Premium over-ear headphones with active noise cancellation',
          price: 199.99,
          stock: 24,
          created_at: '2023-04-18T00:00:00Z',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchProducts();
  }, []);
  
  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.description.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const openEditModal = (product: ProductData) => {
    setCurrentProduct(product);
    setIsModalOpen(true);
  };
  
  const openCreateModal = () => {
    setCurrentProduct(null);
    setIsModalOpen(true);
  };
  
  const handleDeleteProduct = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        // For a real app, you would delete the product from Supabase
        // const { error } = await supabase.from('products').delete().eq('id', id);
        
        // For demo purposes, just filter the product from the state
        setProducts(products.filter(product => product.id !== id));
      } catch (error) {
        console.error('Error deleting product:', error);
      }
    }
  };
  
  // Mock Product Form Component
  const ProductForm = () => {
    return (
      <div className="mt-5 space-y-4">
        <Input
          label="Product Name"
          defaultValue={currentProduct?.name || ''}
          placeholder="Enter product name"
        />
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Description
          </label>
          <textarea
            rows={3}
            defaultValue={currentProduct?.description || ''}
            placeholder="Enter product description"
            className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Price"
            type="number"
            step="0.01"
            min="0"
            defaultValue={currentProduct?.price.toString() || ''}
            placeholder="0.00"
          />
          <Input
            label="Stock"
            type="number"
            min="0"
            defaultValue={currentProduct?.stock.toString() || ''}
            placeholder="0"
          />
        </div>
        
        <div className="flex justify-end space-x-3 pt-5">
          <Button
            variant="outline"
            onClick={() => setIsModalOpen(false)}
            leftIcon={<X size={16} />}
          >
            Cancel
          </Button>
          <Button
            leftIcon={<Check size={16} />}
            onClick={() => {
              // In a real app, you would save the product to Supabase
              setIsModalOpen(false);
              fetchProducts();
            }}
          >
            {currentProduct ? 'Update Product' : 'Create Product'}
          </Button>
        </div>
      </div>
    );
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Products</h1>
          <p className="text-gray-500 dark:text-gray-400">
            Manage your inventory and product catalog
          </p>
        </div>
        <Button leftIcon={<Plus size={16} />} onClick={openCreateModal}>
          Add Product
        </Button>
      </div>
      
      <Card>
        <div className="flex justify-between items-center mb-4">
          <div className="w-full max-w-xs">
            <Input
              placeholder="Search products..."
              leftIcon={<Search className="h-5 w-5 text-gray-400" />}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        {loading ? (
          <div className="text-center py-4">Loading products...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Product
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Price
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Stock
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Added
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
                {filteredProducts.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                      No products found
                    </td>
                  </tr>
                ) : (
                  filteredProducts.map((product) => (
                    <tr key={product.id}>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 bg-gray-200 dark:bg-gray-700 rounded flex items-center justify-center">
                            <Package className="h-6 w-6 text-gray-500 dark:text-gray-300" />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                              {product.name}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400 max-w-xs truncate">
                              {product.description}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                        {formatCurrency(product.price)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          product.stock > 20 
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                            : product.stock > 10
                            ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                            : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                        }`}>
                          {product.stock}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {new Date(product.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2 flex justify-end">
                        <button
                          className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                          onClick={() => openEditModal(product)}
                        >
                          <Edit className="h-5 w-5" />
                        </button>
                        <button
                          className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                          onClick={() => handleDeleteProduct(product.id)}
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </Card>
      
      {/* Modal for creating/editing products */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75 dark:bg-gray-900 dark:opacity-90"></div>
            </div>
            
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            
            <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                {currentProduct ? 'Edit Product' : 'Create New Product'}
              </h3>
              
              <ProductForm />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Products;