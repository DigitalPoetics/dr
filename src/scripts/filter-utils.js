// src/utils/filter-utils.js

export function createFilterUI(entries, textFields, targetElement) {
  const filterState = {
    authors: new Set(),
    containers: new Set(),
    dates: new Set()
  };

  function extractFilters(entries) {
    const authors = [...new Set(entries.map(e => e[textFields.author]).filter(Boolean))];
    const containers = [...new Set(entries.map(e => e[textFields.container]).filter(Boolean))];
    const dates = extractDateRanges(entries.map(e => e[textFields.date]).filter(Boolean));
    
    return { authors: authors.sort(), containers: containers.sort(), dates };
  }

  function extractDateRanges(dates) {
    const years = dates.map(date => {
      const match = date.match(/\d{4}/);
      return match ? parseInt(match[0]) : null;
    }).filter(Boolean);
    
    if (years.length === 0) return [];
    
    const minYear = Math.min(...years);
    const maxYear = Math.max(...years);
    const ranges = [];
    
    for (let start = Math.floor(minYear / 10) * 10; start <= maxYear; start += 10) {
      const end = start + 9;
      const hasEntries = years.some(year => year >= start && year <= end);
      if (hasEntries) {
        ranges.push(`${start}-${end}`);
      }
    }
    
    return ranges;
  }

  function renderFilters() {
    const filters = extractFilters(entries);
    
    const html = `
      <div class="filter-panel">
        <h4>Filter Results</h4>
        
        ${filters.authors.length > 0 ? `
        <div class="filter-section">
          <h5>Authors</h5>
          ${filters.authors.map(author => `
            <label class="filter-item">
              <input type="checkbox" data-filter="author" data-value="${author}">
              ${author}
            </label>
          `).join('')}
        </div>
        ` : ''}
        
        ${filters.containers.length > 0 ? `
        <div class="filter-section">
          <h5>Containers</h5>
          ${filters.containers.map(container => `
            <label class="filter-item">
              <input type="checkbox" data-filter="container" data-value="${container}">
              ${container}
            </label>
          `).join('')}
        </div>
        ` : ''}
        
        ${filters.dates.length > 0 ? `
        <div class="filter-section">
          <h5>Date Ranges</h5>
          ${filters.dates.map(range => `
            <label class="filter-item">
              <input type="checkbox" data-filter="date" data-value="${range}">
              ${range}
            </label>
          `).join('')}
        </div>
        ` : ''}
        
        <button class="clear-filters">Clear All Filters</button>
      </div>
    `;
    
    targetElement.innerHTML = html;
    attachEventListeners();
  }

  function attachEventListeners() {
    const checkboxes = targetElement.querySelectorAll('input[type="checkbox"]');
    const clearButton = targetElement.querySelector('.clear-filters');
    
    checkboxes.forEach(checkbox => {
      checkbox.addEventListener('change', handleFilterChange);
    });
    
    clearButton?.addEventListener('click', clearAllFilters);
  }

  function handleFilterChange(e) {
    const filterType = e.target.dataset.filter;
    const value = e.target.dataset.value;
    
    if (e.target.checked) {
      filterState[filterType + 's'].add(value);
    } else {
      filterState[filterType + 's'].delete(value);
    }
    
    applyFilters();
  }

  function clearAllFilters() {
    filterState.authors.clear();
    filterState.containers.clear();
    filterState.dates.clear();
    
    const checkboxes = targetElement.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach(cb => cb.checked = false);
    
    applyFilters();
  }

  function matchesDateRange(entryDate, range) {
    const [start, end] = range.split('-').map(Number);
    const match = entryDate.match(/\d{4}/);
    if (!match) return false;
    
    const year = parseInt(match[0]);
    return year >= start && year <= end;
  }

  function applyFilters() {
    const resultsList = document.getElementById('results-list');
    if (!resultsList) return;
    
    const listItems = resultsList.querySelectorAll('li');
    
    listItems.forEach((li, index) => {
      const entry = entries[index];
      if (!entry) return;
      
      let show = true;
      
      // Author filter
      if (filterState.authors.size > 0) {
        show = show && filterState.authors.has(entry[textFields.author]);
      }
      
      // Container filter
      if (filterState.containers.size > 0) {
        show = show && filterState.containers.has(entry[textFields.container]);
      }
      
      // Date filter
      if (filterState.dates.size > 0) {
        const entryDate = entry[textFields.date];
        show = show && Array.from(filterState.dates).some(range => 
          matchesDateRange(entryDate, range)
        );
      }
      
      li.style.display = show ? 'list-item' : 'none';
    });
    
    updateResultsCount();
  }

  function updateResultsCount() {
    const resultsList = document.getElementById('results-list');
    const visibleItems = resultsList.querySelectorAll('li:not([style*="display: none"])').length;
    const totalItems = entries.length;
    
    let countElement = document.getElementById('results-count');
    if (!countElement) {
      countElement = document.createElement('p');
      countElement.id = 'results-count';
      countElement.style.fontWeight = 'bold';
      countElement.style.marginBottom = '1rem';
      resultsList.parentNode.insertBefore(countElement, resultsList);
    }
    
    countElement.textContent = `Showing ${visibleItems} of ${totalItems} results`;
  }

  // Add CSS styles
  function addStyles() {
    if (document.getElementById('filter-styles')) return;
    
    const style = document.createElement('style');
    style.id = 'filter-styles';
    style.textContent = `
      .filter-panel {
        margin: 1rem 0;
        padding: 1rem;
        border: var(--image-border, 1px solid #ccc);
        background-color: var(--bg-color, #f9f9f9);
      }
      
      .filter-panel h4 {
        margin: 0 0 1rem 0;
        font-size: 1.3rem;
      }
      
      .filter-section {
        margin-bottom: 1rem;
      }
      
      .filter-section h5 {
        margin: 0 0 0.5rem 0;
        font-size: 1.1rem;
        color: var(--hover-color, #333);
      }
      
      .filter-item {
        display: block;
        margin-bottom: 0.25rem;
        cursor: pointer;
        font-size: 1rem;
      }
      
      .filter-item input {
        margin-right: 0.5rem;
      }
      
      .clear-filters {
        padding: 0.5rem 1rem;
        font-size: 1rem;
        cursor: pointer;
        font-family: 'IM Fell English', serif;
        border: var(--image-border, 1px solid #ccc);
        background-color: ButtonFace;
        transition: background-color 0.3s ease, color 0.3s ease;
      }
      
      .clear-filters:hover {
        background-color: var(--hover-color, #333);
        color: white;
      }
      
      html.dark .filter-panel {
        background-color: var(--dark-bg-color, #333);
      }
      
      html.dark .clear-filters {
        color: var(--light-text, #fff);
      }
    `;
    
    document.head.appendChild(style);
  }

  // Initialize
  addStyles();
  renderFilters();
  updateResultsCount();
  
  return {
    refresh: (newEntries) => {
      entries = newEntries;
      renderFilters();
      updateResultsCount();
    }
  };
}