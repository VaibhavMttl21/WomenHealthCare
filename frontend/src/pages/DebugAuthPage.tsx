import { useAppSelector } from '../hooks/useAppSelector';
import { Card } from '../components/ui/Card';

const DebugAuthPage = () => {
  const { user, token, isAuthenticated } = useAppSelector((state) => state.auth);

  const storedUser = localStorage.getItem('user');
  const storedToken = localStorage.getItem('token');

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">🔍 Auth Debug Page</h1>

        <div className="grid gap-6">
          {/* Redux State */}
          <Card className="p-6">
            <h2 className="text-xl font-bold mb-4 text-blue-600">Redux State</h2>
            <div className="space-y-2">
              <div>
                <strong>isAuthenticated:</strong> 
                <span className={isAuthenticated ? 'text-green-600 ml-2' : 'text-red-600 ml-2'}>
                  {String(isAuthenticated)}
                </span>
              </div>
              <div>
                <strong>User:</strong>
                <pre className="mt-2 p-4 bg-gray-100 rounded overflow-auto">
                  {JSON.stringify(user, null, 2)}
                </pre>
              </div>
              <div>
                <strong>Token:</strong>
                <pre className="mt-2 p-4 bg-gray-100 rounded overflow-auto text-xs break-all">
                  {token ? token.substring(0, 50) + '...' : 'null'}
                </pre>
              </div>
            </div>
          </Card>

          {/* LocalStorage */}
          <Card className="p-6">
            <h2 className="text-xl font-bold mb-4 text-purple-600">LocalStorage</h2>
            <div className="space-y-2">
              <div>
                <strong>Stored User:</strong>
                <pre className="mt-2 p-4 bg-gray-100 rounded overflow-auto">
                  {storedUser ? JSON.stringify(JSON.parse(storedUser), null, 2) : 'null'}
                </pre>
              </div>
              <div>
                <strong>Stored Token:</strong>
                <pre className="mt-2 p-4 bg-gray-100 rounded overflow-auto text-xs break-all">
                  {storedToken ? storedToken.substring(0, 50) + '...' : 'null'}
                </pre>
              </div>
            </div>
          </Card>

          {/* Role Check */}
          <Card className="p-6">
            <h2 className="text-xl font-bold mb-4 text-orange-600">Role Analysis</h2>
            <div className="space-y-4">
              <div>
                <strong>User Role from Redux:</strong>
                <span className="ml-2 font-mono bg-yellow-100 px-2 py-1 rounded">
                  {user?.role || 'undefined'}
                </span>
              </div>
              <div>
                <strong>Type of role:</strong>
                <span className="ml-2 font-mono bg-yellow-100 px-2 py-1 rounded">
                  {typeof user?.role}
                </span>
              </div>
              <div>
                <strong>Check: user.role === 'doctor':</strong>
                <span className={user?.role === 'doctor' ? 'text-green-600 ml-2' : 'text-red-600 ml-2'}>
                  {String(user?.role === 'doctor')}
                </span>
              </div>
              <div>
                <strong>Check: user.role === 'DOCTOR':</strong>
                <span className={(user?.role as any) === 'DOCTOR' ? 'text-green-600 ml-2' : 'text-red-600 ml-2'}>
                  {String((user?.role as any) === 'DOCTOR')}
                </span>
              </div>
              <div>
                <strong>Check: user.role.toLowerCase() === 'doctor':</strong>
                <span className={user?.role?.toLowerCase() === 'doctor' ? 'text-green-600 ml-2' : 'text-red-600 ml-2'}>
                  {String(user?.role?.toLowerCase() === 'doctor')}
                </span>
              </div>
            </div>
          </Card>

          {/* Recommendations */}
          <Card className="p-6 bg-blue-50">
            <h2 className="text-xl font-bold mb-4 text-blue-800">🔧 Recommendations</h2>
            <ul className="space-y-2 text-sm">
              <li>✓ If role is uppercase (DOCTOR), need to convert to lowercase</li>
              <li>✓ Backend returns: <code className="bg-blue-200 px-2 py-1 rounded">role: 'DOCTOR'</code></li>
              <li>✓ Frontend expects: <code className="bg-blue-200 px-2 py-1 rounded">role: 'doctor'</code></li>
              <li>✓ Solution: Convert role to lowercase when storing or checking</li>
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DebugAuthPage;
