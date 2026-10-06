import { Image } from 'expo-image';
import { ArrowDown, Pencil, Plus, Search, Trash2, Warehouse, X } from 'lucide-react-native';
import { useRef, useState } from 'react';
import {
  Alert,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { AppBar } from '@/components/netbrew/app-bar';
import { Button } from '@/components/netbrew/button';
import { Card, SectionHeader } from '@/components/netbrew/card';
import { Chip } from '@/components/netbrew/chip';
import { Screen } from '@/components/netbrew/screen';
import { categories, type CategoryId, type Product } from '@/constants/catalog';
import { colors, formatPeso, type } from '@/constants/netbrew';
import { useProducts, type ProductInput } from '@/providers/products-context';

type ProductFormProps = {
  visible: boolean;
  product: Product | null;
  saving: boolean;
  onClose: () => void;
  onSave: (input: ProductInput) => Promise<void>;
};

export default function InventoryScreen() {
  const { products, loading, error, refresh, addProduct, updateProduct, deleteProduct } =
    useProducts();
  const [editing, setEditing] = useState<Product | null>(null);
  const [formVisible, setFormVisible] = useState(false);
  const [saving, setSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [canScroll, setCanScroll] = useState(false);
  const scrollView = useRef<ScrollView>(null);
  const contentHeight = useRef(0);
  const viewportHeight = useRef(0);
  const normalizedSearchQuery = searchQuery.trim().toLocaleLowerCase();
  const filteredProducts = normalizedSearchQuery
    ? products.filter((product) => {
        const categoryLabel = categories.find(
          (category) => category.id === product.category
        )?.label;
        return [product.name, product.description, categoryLabel]
          .filter(Boolean)
          .some((value) => value?.toLocaleLowerCase().includes(normalizedSearchQuery));
      })
    : products;

  function retryLoad() {
    void refresh().catch((refreshError: unknown) => {
      Alert.alert(
        'Inventory is still unavailable',
        refreshError instanceof Error ? refreshError.message : String(refreshError)
      );
    });
  }

  function openNewProduct() {
    setEditing(null);
    setFormVisible(true);
  }

  function openEditProduct(product: Product) {
    setEditing(product);
    setFormVisible(true);
  }

  async function saveProduct(input: ProductInput) {
    setSaving(true);
    try {
      if (editing) {
        await updateProduct(editing.id, input);
      } else {
        await addProduct(input);
      }
      setFormVisible(false);
    } catch (saveError) {
      Alert.alert(
        'Could not save product',
        saveError instanceof Error ? saveError.message : String(saveError)
      );
    } finally {
      setSaving(false);
    }
  }

  function confirmDelete(product: Product) {
    Alert.alert('Delete product?', `${product.name} will be removed from the local catalog.`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          void deleteProduct(product.id).catch((deleteError: unknown) => {
            Alert.alert(
              'Could not delete product',
              deleteError instanceof Error ? deleteError.message : String(deleteError)
            );
          });
        },
      },
    ]);
  }

  if (error) {
    return (
      <Screen>
        <AppBar subtitle="Manage your local catalog" title="Inventory" />
        <View style={styles.errorArea}>
          <Text style={styles.errorTitle}>Inventory could not be loaded</Text>
          <Text style={styles.errorText}>{error}</Text>
          <Button label="TRY AGAIN" onPress={retryLoad} />
        </View>
      </Screen>
    );
  }

  return (
    <>
      <Screen>
        <AppBar subtitle="Stored on this device · works offline" title="Inventory" />
        <View style={styles.scrollArea}>
          <ScrollView
            contentContainerStyle={styles.content}
            onContentSizeChange={(_, height) => {
              contentHeight.current = height;
              setCanScroll(height > viewportHeight.current + 1);
            }}
            onLayout={(event) => {
              viewportHeight.current = event.nativeEvent.layout.height;
              setCanScroll(contentHeight.current > viewportHeight.current + 1);
            }}
            onScroll={(event) => {
              const { contentOffset, contentSize, layoutMeasurement } = event.nativeEvent;
              setCanScroll(
                contentOffset.y + layoutMeasurement.height < contentSize.height - 8
              );
            }}
            ref={scrollView}
            scrollEventThrottle={16}
            showsVerticalScrollIndicator
            style={styles.scroll}>
            <Card style={styles.summary}>
              <View style={styles.summaryIcon}>
                <Warehouse color={colors.brand} size={22} />
              </View>
              <View style={styles.summaryCopy}>
                <Text style={styles.summaryCount}>{products.length} products</Text>
                <Text style={styles.summaryCaption}>Catalog saved in local SQLite</Text>
              </View>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Add product"
                onPress={openNewProduct}
                style={({ pressed }) => [styles.addButton, pressed && styles.pressed]}>
                <Plus color={colors.surface} size={20} />
              </Pressable>
            </Card>

            <View style={styles.productsSection}>
              <SectionHeader title="Products" />
              <View style={styles.searchBar}>
                <Search color={colors.textMuted} size={20} />
                <TextInput
                  accessibilityLabel="Search products"
                  autoCapitalize="none"
                  onChangeText={setSearchQuery}
                  placeholder="Search products"
                  placeholderTextColor={colors.textMuted}
                  returnKeyType="search"
                  style={styles.searchInput}
                  value={searchQuery}
                />
                {searchQuery.length > 0 ? (
                  <Pressable
                    accessibilityLabel="Clear product search"
                    accessibilityRole="button"
                    hitSlop={8}
                    onPress={() => setSearchQuery('')}
                    style={styles.clearSearchButton}>
                    <X color={colors.textMuted} size={18} />
                  </Pressable>
                ) : null}
              </View>
              {loading ? (
                <Card style={styles.emptyCard}>
                  <Text style={styles.emptyText}>Loading saved products…</Text>
                </Card>
              ) : products.length === 0 ? (
                <Card style={styles.emptyCard}>
                  <Text style={styles.emptyText}>
                    Your catalog is empty. Add a product to get started.
                  </Text>
                </Card>
              ) : filteredProducts.length === 0 ? (
                <Card style={styles.emptyCard}>
                  <Text style={styles.emptyText}>
                    No products found for “{searchQuery.trim()}”.
                  </Text>
                </Card>
              ) : (
                <View style={styles.productList}>
                  {filteredProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onDelete={() => confirmDelete(product)}
                      onEdit={() => openEditProduct(product)}
                    />
                  ))}
                </View>
              )}
            </View>
          </ScrollView>
          {canScroll ? (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Scroll to bottom"
              onPress={() => scrollView.current?.scrollToEnd({ animated: true })}
              style={({ pressed }) => [styles.scrollButton, pressed && styles.pressed]}>
              <ArrowDown color={colors.surface} size={22} />
            </Pressable>
          ) : null}
        </View>
      </Screen>

      {formVisible ? (
        <ProductForm
          key={editing?.id ?? 'new'}
          onClose={() => setFormVisible(false)}
          onSave={saveProduct}
          product={editing}
          saving={saving}
          visible
        />
      ) : null}
    </>
  );
}

function ProductCard({
  product,
  onEdit,
  onDelete,
}: {
  product: Product;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const categoryLabel = categories.find((category) => category.id === product.category)?.label;

  return (
    <Card style={styles.productCard}>
      <Image contentFit="cover" source={product.image} style={styles.productImage} />
      <View style={styles.productInfo}>
        <Text numberOfLines={1} style={styles.productName}>
          {product.name}
        </Text>
        <Text numberOfLines={1} style={styles.productMeta}>
          {categoryLabel} · {formatPeso(product.price)}
        </Text>
        <Text style={[styles.stock, product.stock === 0 && styles.stockEmpty]}>
          {product.stock} in stock
        </Text>
      </View>
      <View style={styles.actions}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Edit ${product.name}`}
          onPress={onEdit}
          style={styles.iconButton}>
          <Pencil color={colors.brand} size={18} />
        </Pressable>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Delete ${product.name}`}
          onPress={onDelete}
          style={styles.iconButton}>
          <Trash2 color={colors.textMuted} size={18} />
        </Pressable>
      </View>
    </Card>
  );
}

function ProductForm({ visible, product, saving, onClose, onSave }: ProductFormProps) {
  const [name, setName] = useState(product?.name ?? '');
  const [description, setDescription] = useState(product?.description ?? '');
  const [price, setPrice] = useState(product ? String(product.price) : '');
  const [stock, setStock] = useState(product ? String(product.stock) : '');
  const [category, setCategory] = useState<CategoryId>(product?.category ?? 'coffee');
  const [validationError, setValidationError] = useState<string | null>(null);

  function submit() {
    const parsedPrice = Number(price);
    const parsedStock = Number(stock);

    if (!name.trim() || !description.trim()) {
      setValidationError('Enter a product name and description.');
      return;
    }
    if (!Number.isFinite(parsedPrice) || parsedPrice <= 0) {
      setValidationError('Price must be a number greater than zero.');
      return;
    }
    if (!Number.isInteger(parsedStock) || parsedStock < 0) {
      setValidationError('Stock must be a whole number zero or greater.');
      return;
    }

    setValidationError(null);
    void onSave({ name, description, price: parsedPrice, stock: parsedStock, category });
  }

  return (
    <Modal animationType="slide" onRequestClose={onClose} presentationStyle="pageSheet" visible={visible}>
      <Screen edges={['top', 'bottom']}>
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>{product ? 'Edit product' : 'Add product'}</Text>
          <Pressable accessibilityRole="button" onPress={onClose} style={styles.cancelButton}>
            <Text style={styles.cancelLabel}>Cancel</Text>
          </Pressable>
        </View>
        <ScrollView contentContainerStyle={styles.form} keyboardShouldPersistTaps="handled">
          <Field label="Product name" onChangeText={setName} value={name} />
          <Field
            label="Description"
            multiline
            onChangeText={setDescription}
            value={description}
          />
          <View style={styles.twoFields}>
            <Field
              keyboardType="decimal-pad"
              label="Price (₱)"
              onChangeText={setPrice}
              value={price}
            />
            <Field
              keyboardType="number-pad"
              label="Stock"
              onChangeText={setStock}
              value={stock}
            />
          </View>
          <View style={styles.categoryField}>
            <Text style={styles.fieldLabel}>Category</Text>
            <View style={styles.categoryChips}>
              {categories.map((item) => (
                <Chip
                  active={category === item.id}
                  key={item.id}
                  label={item.label}
                  onPress={() => setCategory(item.id)}
                />
              ))}
            </View>
          </View>
          {validationError ? <Text style={styles.validationError}>{validationError}</Text> : null}
          <Button
            disabled={saving}
            label={saving ? 'SAVING…' : product ? 'SAVE CHANGES' : 'ADD TO INVENTORY'}
            onPress={submit}
          />
        </ScrollView>
      </Screen>
    </Modal>
  );
}

function Field({
  label,
  value,
  onChangeText,
  keyboardType = 'default',
  multiline = false,
}: {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  keyboardType?: 'default' | 'decimal-pad' | 'number-pad';
  multiline?: boolean;
}) {
  return (
    <View style={styles.field}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <TextInput
        keyboardType={keyboardType}
        multiline={multiline}
        onChangeText={onChangeText}
        placeholder={label}
        placeholderTextColor={colors.textMuted}
        style={[styles.input, multiline && styles.multilineInput]}
        value={value}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: 16,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 24,
  },
  scrollArea: {
    flex: 1,
    minHeight: 0,
  },
  scroll: {
    flex: 1,
    minHeight: 0,
  },
  summary: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
  },
  summaryIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.brandSoft,
  },
  summaryCopy: {
    flex: 1,
    gap: 3,
  },
  summaryCount: {
    ...type.cardTitleSm,
    color: colors.text,
  },
  summaryCaption: {
    ...type.caption,
    color: colors.textMuted,
  },
  addButton: {
    width: 44,
    height: 44,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.brand,
  },
  scrollButton: {
    position: 'absolute',
    right: 12,
    bottom: 16,
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.brand,
    elevation: 4,
    boxShadow: '0 3px 8px rgba(31, 31, 31, 0.22)',
  },
  pressed: {
    opacity: 0.85,
  },
  productsSection: {
    gap: 8,
  },
  searchBar: {
    minHeight: 48,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: 12,
    backgroundColor: colors.surface,
  },
  searchInput: {
    flex: 1,
    minHeight: 46,
    paddingVertical: 0,
    color: colors.text,
    fontSize: 14,
  },
  clearSearchButton: {
    width: 32,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  productList: {
    gap: 8,
  },
  productCard: {
    minHeight: 98,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 10,
  },
  productImage: {
    width: 68,
    height: 68,
    borderRadius: 10,
  },
  productInfo: {
    flex: 1,
    gap: 4,
  },
  productName: {
    ...type.nameSm,
    color: colors.text,
  },
  productMeta: {
    ...type.caption,
    color: colors.textMuted,
  },
  stock: {
    ...type.labelBold,
    color: colors.brand,
  },
  stockEmpty: {
    color: colors.accent,
  },
  actions: {
    alignItems: 'center',
    gap: 2,
  },
  iconButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyCard: {
    padding: 16,
  },
  emptyText: {
    ...type.bodySm,
    color: colors.textMuted,
  },
  errorArea: {
    flex: 1,
    justifyContent: 'center',
    gap: 12,
    padding: 24,
  },
  errorTitle: {
    ...type.screenTitle,
    color: colors.text,
  },
  errorText: {
    ...type.bodySm,
    color: colors.textMuted,
  },
  modalHeader: {
    minHeight: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  modalTitle: {
    ...type.pageTitle,
    color: colors.text,
  },
  cancelButton: {
    minHeight: 44,
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  cancelLabel: {
    ...type.labelBold,
    color: colors.brand,
  },
  form: {
    gap: 16,
    padding: 20,
    paddingBottom: 32,
  },
  field: {
    flex: 1,
    gap: 6,
  },
  fieldLabel: {
    ...type.labelBold,
    color: colors.text,
  },
  input: {
    minHeight: 48,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: 12,
    color: colors.text,
    backgroundColor: colors.surface,
    fontSize: 14,
  },
  multilineInput: {
    minHeight: 84,
    paddingTop: 12,
    textAlignVertical: 'top',
  },
  twoFields: {
    flexDirection: 'row',
    gap: 12,
  },
  categoryField: {
    gap: 8,
  },
  categoryChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  validationError: {
    ...type.bodySm,
    color: '#B42318',
  },
});
