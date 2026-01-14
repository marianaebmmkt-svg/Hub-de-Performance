
import React, { useState } from 'react';
import { MOCK_USERS } from '../constants';
import { User } from '../types';

const AdminManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>(MOCK_USERS);
  const [newEmail, setNewEmail] = useState('');

  const handleAddUser = () => {
    if (!newEmail.includes('@')) return;
    const newUser: User = {
      id: `u${Date.now()}`,
      email: newEmail,
      role: 'viewer',
      status: 'pending'
    };
    setUsers([...users, newUser]);
    setNewEmail('');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <h3 className="text-xl font-bold mb-4">Gerenciamento de Usuários</h3>
        <p className="text-sm text-slate-500 mb-6">Controle quem tem acesso ao Hub de Performance da Mari.</p>

        <div className="flex space-x-2 mb-8">
          <input 
            type="email" 
            placeholder="E-mail do novo colaborador" 
            className="flex-1 p-2 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
          />
          <button 
            onClick={handleAddUser}
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors"
          >
            Convidar
          </button>
        </div>

        <div className="overflow-hidden border border-slate-100 rounded-lg">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="px-4 py-3 font-semibold text-slate-600">E-mail</th>
                <th className="px-4 py-3 font-semibold text-slate-600">Role</th>
                <th className="px-4 py-3 font-semibold text-slate-600">Status</th>
                <th className="px-4 py-3 font-semibold text-slate-600">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {users.map(user => (
                <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3 font-medium text-slate-800">{user.email}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                      user.role === 'admin' ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`flex items-center space-x-1.5 ${
                      user.status === 'active' ? 'text-emerald-600' : 'text-amber-500'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${user.status === 'active' ? 'bg-emerald-600' : 'bg-amber-500'}`}></span>
                      <span className="text-xs font-medium">{user.status}</span>
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button className="text-rose-600 hover:text-rose-800 font-medium">Remover</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminManagement;
