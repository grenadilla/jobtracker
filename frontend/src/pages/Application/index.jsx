import React, { useEffect, useState } from 'react';
import { deleteApplication, searchApplications, updateApplication } from '../../utils/api';

import styles from './styles.module.scss';

const num_per_page = 25;

const Application = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [applications, setApplications] = useState(null);

  useEffect(() => {
    setApplications(null);
    searchApplications(page, num_per_page, searchQuery)
      .then(data => setApplications(data))
      .catch(err => alert(err));
  }, [searchQuery, page]);

  if (!applications) {
    return 'Loading...';
  }
  
  return (
    <div className={styles.applicationPage}>
      <input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}  />
      <div className={styles.applicationGrid}>
        {applications.map(({ id, user_id, posting_id, status, portal }) => (
          <div className={styles.application}>
            <input value={user_id} onChange={(e) => updateApplication({ id, user_id: e.target.value, posting_id, status, portal }) } />
            <br />
            <input value={posting_id} onChange={(e) => updateApplication({ id, user_id, posting_id: e.target.value, status, portal }) } />
            <select value={status} onChange={(e) => updateApplication({ id, user_id, posting_id, status: e.target.value, portal }) }>
              <option value="INTERESTED">INTERESTED</option>
              <option value="APPLIED">APPLIED</option>
              <option value="REJECTED">REJECTED</option>
              <option value="ACCEPTED">ACCEPTED</option>
            </select>
            <input value={portal} onChange={(e) => updateApplication({ id, user_id, posting_id, status, portal: e.target.value }) } />
            <button onClick={() => deleteApplication(id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  )
};

export default Application;
