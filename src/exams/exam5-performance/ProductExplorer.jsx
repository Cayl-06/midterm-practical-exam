import { memo, useState, useMemo, useCallback, useEffect } from 'react';

const CATEGORIES = ['All', 'Electronics', 'Books', 'Stationery', 'Audio', 'Accessories'];
const ADJECTIVES = ['Pro', 'Ultra', 'Compact', 'Ergonomic', 'Wireless', 'Studio', 'Smart', 'Classic', 'Prime', 'Lite'];
const NOUNS = ['Keyboard', 'Monitor', 'Notebook', 'Headphones', 'Desk Lamp', 'Webcam', 'Microphone', 'Backpack', 'Stylus', 'Dock'];

const GENERATED_PRODUCTS = Array.from({ length: 520 }, (_, index) => {
  const id = index + 1;
  const category = CATEGORIES[(index % (CATEGORIES.length - 1)) + 1];
  const adjective = ADJECTIVES[index % ADJECTIVES.length];
  const noun = NOUNS[Math.floor(index / ADJECTIVES.length) % NOUNS.length];
  const price = Number((((index * 17) % 240) + 14.99).toFixed(2));
  const rating = Number((3.5 + ((index * 7) % 16) / 10).toFixed(1));

  return {
    id,
    sku: `SKU-${String(id).padStart(4, '0')}`,
    name: `${adjective} ${noun} #${id}`,
    category,
    price,
    rating
  };
});

const DEBUGGING_CASES = [
  {
    id: 'case-12',
    title: 'Case 12: Missing query Dependency in useMemo Causing Stale Results',
    brokenCode: `const visibleProducts = useMemo(() => {
  return GENERATED_PRODUCTS
    .filter((p) => p.name.toLowerCase().includes(query.toLowerCase()))
    .sort((a, b) => (sortOrder === 'asc' ? a.price - b.price : b.price - a.price));
}, [category, sortOrder]);`,
    fixedCode: `const visibleProducts = useMemo(() => {
  const normalizedQuery = query.trim().toLowerCase();
  return GENERATED_PRODUCTS.filter((product) => {
    const matchesCategory = category === 'All' || product.category === category;
    const matchesQuery =
      product.name.toLowerCase().includes(normalizedQuery) ||
      product.sku.toLowerCase().includes(normalizedQuery);
    return matchesCategory && matchesQuery;
  }).sort((a, b) => (sortOrder === 'asc' ? a.price - b.price : b.price - a.price));
}, [query, category, sortOrder]);`,
    explanation:
      'useMemo caches its return value until one of its listed dependencies changes. When query was omitted from the dependency array, typing into the search box triggered a parent render, but useMemo returned the old cached list computed with the initial empty query.'
  },
  {
    id: 'case-13',
    title: 'Case 13: Missing Dependency in useCallback Using Outdated Data',
    brokenCode: `const handleSelectProduct = useCallback((product) => {
  setSelectedRecord({
    product,
    activeProject: projectTag
  });
}, []);`,
    fixedCode: `const handleSelectProduct = useCallback(
  (product) => {
    setSelectedRecord({
      product,
      activeProject: projectTag
    });
  },
  [projectTag]
);`,
    explanation:
      'useCallback memoizes a function closure. With an empty dependency array [], handleSelectProduct stays frozen with the initial render’s projectTag value. Including [projectTag] ensures the callback stays stable during unrelated renders (like parent counter clicks) while updating whenever projectTag changes.'
  },
  {
    id: 'case-14',
    title: 'Case 14: Moving Analytics Side Effect Out of useMemo and Into useEffect',
    brokenCode: `const visibleProducts = useMemo(() => {
  const result = filterAndSortProducts(query, category, sortOrder);
  console.log('[Analytics] Filter executed:', result.length);
  setAnalyticsLogCount((c) => c + 1);
  return result;
}, [query, category, sortOrder]);`,
    fixedCode: `const visibleProducts = useMemo(() => {
  return filterAndSortProducts(query, category, sortOrder);
}, [query, category, sortOrder]);

useEffect(() => {
  console.log('[Exam 5 Analytics] Filter/Sort synchronized:', {
    query,
    category,
    sortOrder,
    resultCount: visibleProducts.length
  });
}, [query, category, sortOrder, visibleProducts.length]);`,
    explanation:
      'useMemo runs during rendering and must remain a pure calculation without side effects. React may discard or recompute memoized values in StrictMode or concurrent rendering. Side effects such as analytics logging or network calls belong strictly inside useEffect, which runs after the render commits.'
  }
];

const renderMetrics = { childRenderCount: 0 };

const ProductList = memo(function ProductList({
  products,
  selectedProductId,
  onSelectProduct
}) {
  renderMetrics.childRenderCount += 1;
  const currentRenderCount = renderMetrics.childRenderCount;
  console.log(
    `[Exam 5] <ProductList /> rendered (Render #${currentRenderCount}) — displaying ${products.length} products.`
  );

  const previewSlice = products.slice(0, 40);

  return (
    <div className="product-list-wrapper" data-testid="product-list-container">
      <div className="product-list-meta">
        <span>
          Showing <strong>{previewSlice.length}</strong> of{' '}
          <strong data-testid="total-matching-products">{products.length}</strong> matching products
          (from {GENERATED_PRODUCTS.length} total records)
        </span>
        <span className="badge badge-success" data-testid="child-render-badge">
          ProductList Render Count: #{currentRenderCount} (Check Console)
        </span>
      </div>

      <div className="product-table-scroll">
        <table className="product-table">
          <thead>
            <tr>
              <th>SKU</th>
              <th>Product Name</th>
              <th>Category</th>
              <th>Rating</th>
              <th>Price</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {previewSlice.map((product) => {
              const isSelected = product.id === selectedProductId;
              return (
                <tr
                  key={product.id}
                  className={isSelected ? 'selected-row' : ''}
                >
                  <td>
                    <code>{product.sku}</code>
                  </td>
                  <td>
                    <strong>{product.name}</strong>
                  </td>
                  <td>
                    <span className="badge badge-neutral">{product.category}</span>
                  </td>
                  <td>{product.rating.toFixed(1)} ★</td>
                  <td className="price-cell">${product.price.toFixed(2)}</td>
                  <td>
                    <button
                      type="button"
                      className={`btn btn-small ${isSelected ? 'btn-accent' : 'btn-outline'}`}
                      onClick={() => onSelectProduct(product)}
                    >
                      {isSelected ? 'Selected' : 'Select'}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
});

const ProductExplorer = () => {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');
  const [sortOrder, setSortOrder] = useState('asc');
  const [projectTag, setProjectTag] = useState('Q4-Campus-Lab');
  const [selectedRecord, setSelectedRecord] = useState(null);

  const [unrelatedCount, setUnrelatedCount] = useState(0);
  const [showDebug, setShowDebug] = useState(true);

  const visibleProducts = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    const filtered = GENERATED_PRODUCTS.filter((product) => {
      const matchesCategory = category === 'All' || product.category === category;
      const matchesQuery =
        normalizedQuery === '' ||
        product.name.toLowerCase().includes(normalizedQuery) ||
        product.sku.toLowerCase().includes(normalizedQuery);
      return matchesCategory && matchesQuery;
    });

    return [...filtered].sort((a, b) =>
      sortOrder === 'asc' ? a.price - b.price : b.price - a.price
    );
  }, [query, category, sortOrder]);

  const handleSelectProduct = useCallback(
    (product) => {
      setSelectedRecord({
        product,
        assignedProject: projectTag
      });
    },
    [projectTag]
  );

  const lastAnalyticsMessage = `Analytics synced: category="${category}", query="${query}", sort="${sortOrder}", matches=${visibleProducts.length}`;

  useEffect(() => {
    console.log(`[Exam 5 Analytics] ${lastAnalyticsMessage}`);
  }, [lastAnalyticsMessage]);

  const isFilterActive = query.trim() !== '' || category !== 'All' || sortOrder !== 'asc';

  return (
    <section className="exam-container" aria-labelledby="exam5-heading">
      <header className="exam-header">
        <div>
          <span className="exam-tag">Practical Exam 5 • 20 pts</span>
          <h1 id="exam5-heading">Product Explorer Performance Repair</h1>
          <p className="exam-subtitle">
            Primary Hooks: <code>useMemo</code>, <code>useCallback</code>, &amp;{' '}
            <code>React.memo</code> — Filtering/sorting 520 products while isolating child renders
            from unrelated parent state updates.
          </p>
        </div>
        <div className="header-badges">
          <span className="badge badge-primary">
            Total Dataset: {GENERATED_PRODUCTS.length} Products
          </span>
          <span className="badge badge-warning" data-testid="unrelated-counter-badge">
            Unrelated Parent Counter: {unrelatedCount}
          </span>
        </div>
      </header>

      <div className="exam-grid">
        <div className="card">
          <h2>Filter, Category &amp; Sort Controls</h2>

          <div className="form-group">
            <label htmlFor="product-search-input">Search by Product Name or SKU:</label>
            <input
              id="product-search-input"
              type="text"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="e.g., Keyboard, Studio, SKU-0015..."
              className="text-input"
            />
          </div>

          <div className="controls-row-2col">
            <div className="form-group">
              <label htmlFor="product-category-select">Category Filter:</label>
              <select
                id="product-category-select"
                value={category}
                onChange={(event) => setCategory(event.target.value)}
                className="select-input"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="product-sort-select">Price Sort Order:</label>
              <select
                id="product-sort-select"
                value={sortOrder}
                onChange={(event) => setSortOrder(event.target.value)}
                className="select-input"
              >
                <option value="asc">Price: Low to High (ASC)</option>
                <option value="desc">Price: High to Low (DESC)</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="project-tag-select">
              Active Project Tag (Dependency of <code>handleSelectProduct</code> useCallback):
            </label>
            <select
              id="project-tag-select"
              value={projectTag}
              onChange={(event) => setProjectTag(event.target.value)}
              className="select-input"
            >
              <option value="Q4-Campus-Lab">Q4-Campus-Lab</option>
              <option value="Remote-Workstation-Grant">Remote-Workstation-Grant</option>
              <option value="Design-Studio-Upgrade">Design-Studio-Upgrade</option>
            </select>
          </div>

          {isFilterActive && (
            <button
              type="button"
              className="btn btn-secondary btn-small"
              onClick={() => {
                setQuery('');
                setCategory('All');
                setSortOrder('asc');
              }}
            >
              Reset All Product Filters
            </button>
          )}
        </div>

        <div className="card">
          <h2>Unrelated Parent Render Test &amp; Selection</h2>
          <p className="helper-text">
            Click the button below to re-render <code>ProductExplorer</code> (parent). Because{' '}
            <code>visibleProducts</code> is memoized with <code>useMemo</code>,{' '}
            <code>handleSelectProduct</code> is memoized with <code>useCallback</code>, and{' '}
            <code>ProductList</code> is wrapped in <code>React.memo</code>,{' '}
            <strong>ProductList will NOT re-render!</strong>
          </p>

          <div className="button-group">
            <button
              type="button"
              className="btn btn-accent"
              onClick={() => setUnrelatedCount((prev) => prev + 1)}
              data-testid="unrelated-counter-btn"
            >
              Increment Unrelated Parent Counter ({unrelatedCount})
            </button>
          </div>

          <div className="callout-box">
            <strong>Selected Product State:</strong>
            {selectedRecord ? (
              <p data-testid="selected-product-summary">
                Selected <strong>{selectedRecord.product.name}</strong> ($
                {selectedRecord.product.price.toFixed(2)}) assigned to project{' '}
                <code>{selectedRecord.assignedProject}</code>.
              </p>
            ) : (
              <p>Click &quot;Select&quot; on any row in the ProductList table below.</p>
            )}
          </div>

          <div className="telemetry-item">
            <span className="telemetry-label">useEffect Analytics Log (Moved out of useMemo)</span>
            <code className="telemetry-code">{lastAnalyticsMessage}</code>
          </div>
        </div>
      </div>

      <div className="card">
        <h2>Memoized ProductList Component (React.memo)</h2>
        <ProductList
          products={visibleProducts}
          selectedProductId={selectedRecord?.product?.id ?? null}
          onSelectProduct={handleSelectProduct}
        />
      </div>

      <div className="card">
        <h2>When Memoization Is Unnecessary (Requirement 5)</h2>
        <p className="helper-text">
          Memoization has its own memory and dependency-comparison overhead. Below is a concrete
          example from this component where <code>useMemo</code> is <strong>unnecessary</strong>:
        </p>
        <div className="code-comparison">
          <div className="code-block broken">
            <span className="code-label">Unnecessary Over-Memoization</span>
            <pre>
              <code>{`const isFilterActive = useMemo(() => {
  return query.trim() !== '' || category !== 'All' || sortOrder !== 'asc';
}, [query, category, sortOrder]);`}</code>
            </pre>
          </div>
          <div className="code-block fixed">
            <span className="code-label">Clean Direct Calculation</span>
            <pre>
              <code>{`const isFilterActive =
  query.trim() !== '' || category !== 'All' || sortOrder !== 'asc';`}</code>
            </pre>
          </div>
        </div>
        <p className="debug-explanation">
          <strong>Technical Explanation:</strong> Evaluating three primitive string comparisons takes
          nanoseconds (O(1) time) and produces a primitive <code>boolean</code> value. In JavaScript,
          booleans are compared by value (<code>true === true</code>), so passing{' '}
          <code>isFilterActive</code> to a child never causes a new object reference problem. Calling{' '}
          <code>useMemo</code> here allocates a dependency array and performs array comparison work on
          every render that costs more than the boolean expression itself.
        </p>
      </div>

      <div className="debug-panel card">
        <div className="debug-panel-header">
          <h2>Debugging &amp; Technical Explanation (Cases 12–14)</h2>
          <button
            type="button"
            className="btn btn-small"
            onClick={() => setShowDebug((prev) => !prev)}
          >
            {showDebug ? 'Hide Details' : 'Show Details'}
          </button>
        </div>

        {showDebug && (
          <div className="debug-cases-grid">
            {DEBUGGING_CASES.map((item) => (
              <article key={item.id} className="debug-case-card">
                <h3>{item.title}</h3>
                <div className="code-comparison">
                  <div className="code-block broken">
                    <span className="code-label">Faulty Starter Code</span>
                    <pre>
                      <code>{item.brokenCode}</code>
                    </pre>
                  </div>
                  <div className="code-block fixed">
                    <span className="code-label">Repaired Code</span>
                    <pre>
                      <code>{item.fixedCode}</code>
                    </pre>
                  </div>
                </div>
                <p className="debug-explanation">{item.explanation}</p>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default ProductExplorer;
