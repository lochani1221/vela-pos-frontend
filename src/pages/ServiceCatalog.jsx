import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import Tabs from '../components/Tabs';
import ServiceTable from '../components/ServiceTable';
import { SERVICES, SERVICE_CATEGORIES } from '../data/services';

const TABS = ['All', ...SERVICE_CATEGORIES];

export default function ServiceCatalog() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('All');
  const [search, setSearch] = useState('');

  const filteredServices = useMemo(() => {
    return SERVICES.filter((service) => {
      const matchesTab = activeTab === 'All' || service.category === activeTab;
      const matchesSearch = service.name
        .toLowerCase()
        .includes(search.toLowerCase());
      return matchesTab && matchesSearch;
    });
  }, [activeTab, search]);

  // Group the filtered list by category so each renders under its own section label
  const grouped = useMemo(() => {
    const groups = {};
    for (const service of filteredServices) {
      if (!groups[service.category]) groups[service.category] = [];
      groups[service.category].push(service);
    }
    return groups;
  }, [filteredServices]);

   function handleEdit(service) {
    navigate(`/services/${service.id}`);
  }

  function handleAddService() {
    // Wire this up to open a "create service" modal / route later
    console.log('Add new service');
  }

  return (
    <>
      <PageHeader eyebrow="Service Management" title="Service Catalog">
        <input
          className="search-input"
          placeholder="Search services..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button className="btn btn-primary" onClick={handleAddService}>
          + Add Service
        </button>
      </PageHeader>

      <Tabs tabs={TABS} active={activeTab} onChange={setActiveTab} />

      {Object.keys(grouped).length === 0 && (
        <p style={{ color: 'var(--ink-soft)' }}>No services match your search.</p>
      )}

      {Object.entries(grouped).map(([category, services]) => (
        <div key={category}>
          <div className="section-label">{category}</div>
          <div className="panel" style={{ marginBottom: 24 }}>
            <ServiceTable services={services} onEdit={handleEdit} />
          </div>
        </div>
      ))}
    </>
  );
}
