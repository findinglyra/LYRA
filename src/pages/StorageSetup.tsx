import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function StorageSetup() {
  const [isChecking, setIsChecking] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [bucketStatus, setBucketStatus] = useState<'unknown' | 'exists' | 'missing' | 'error'>('unknown');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const checkBucketStatus = async () => {
    setIsChecking(true);
    setErrorMessage('');
    setSuccessMessage('');
    
    try {
      const { data: buckets, error } = await supabase.storage.listBuckets();
      
      if (error) {
        setBucketStatus('error');
        setErrorMessage(`Error checking buckets: ${error.message}`);
        return;
      }
      
      const userContentBucket = buckets?.find(bucket => bucket.name === 'user-content');
      
      if (userContentBucket) {
        setBucketStatus('exists');
        setSuccessMessage('✅ user-content bucket already exists and is ready to use!');
      } else {
        setBucketStatus('missing');
        setErrorMessage('❌ user-content bucket is missing and needs to be created.');
      }
    } catch (error) {
      setBucketStatus('error');
      setErrorMessage(`Unexpected error: ${error}`);
    } finally {
      setIsChecking(false);
    }
  };

  const createBucket = async () => {
    setIsCreating(true);
    setErrorMessage('');
    setSuccessMessage('');
    
    try {
      // Create the bucket
      const { data, error } = await supabase.storage.createBucket('user-content', {
        public: true,
        allowedMimeTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
        fileSizeLimit: 5242880 // 5MB
      });
      
      if (error) {
        setErrorMessage(`Error creating bucket: ${error.message}`);
        return;
      }
      
      setBucketStatus('exists');
      setSuccessMessage('🎉 Successfully created user-content bucket! Profile image uploads will now work.');
      
    } catch (error) {
      setErrorMessage(`Unexpected error: ${error}`);
    } finally {
      setIsCreating(false);
    }
  };

  const testUpload = async () => {
    try {
      // Create a small test file
      const testContent = 'test upload';
      const testFile = new Blob([testContent], { type: 'text/plain' });
      
      const { error: uploadError } = await supabase.storage
        .from('user-content')
        .upload('test/test-upload.txt', testFile);
        
      if (uploadError) {
        setErrorMessage(`Upload test failed: ${uploadError.message}`);
        return;
      }
      
      // Clean up test file
      await supabase.storage
        .from('user-content')
        .remove(['test/test-upload.txt']);
        
      setSuccessMessage('✅ Upload test successful! Storage is working properly.');
      
    } catch (error) {
      setErrorMessage(`Upload test error: ${error}`);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            📦 Storage Bucket Setup
          </CardTitle>
          <CardDescription>
            Set up the required storage bucket for profile image uploads
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          
          {/* Status Display */}
          {bucketStatus === 'exists' && (
            <Alert className="border-green-200 bg-green-50">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                Storage bucket is ready! Profile image uploads should work.
              </AlertDescription>
            </Alert>
          )}
          
          {bucketStatus === 'missing' && (
            <Alert className="border-yellow-200 bg-yellow-50">
              <XCircle className="h-4 w-4 text-yellow-600" />
              <AlertDescription className="text-yellow-800">
                Storage bucket needs to be created for image uploads to work.
              </AlertDescription>
            </Alert>
          )}
          
          {bucketStatus === 'error' && (
            <Alert className="border-red-200 bg-red-50">
              <XCircle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800">
                Error checking storage bucket status.
              </AlertDescription>
            </Alert>
          )}
          
          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button 
              onClick={checkBucketStatus} 
              disabled={isChecking}
              variant="outline"
            >
              {isChecking && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Check Bucket Status
            </Button>
            
            {bucketStatus === 'missing' && (
              <Button 
                onClick={createBucket} 
                disabled={isCreating}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {isCreating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Create Storage Bucket
              </Button>
            )}
            
            {bucketStatus === 'exists' && (
              <Button 
                onClick={testUpload} 
                variant="outline"
                className="border-green-300 text-green-700 hover:bg-green-50"
              >
                Test Upload
              </Button>
            )}
          </div>
          
          {/* Status Messages */}
          {errorMessage && (
            <Alert className="border-red-200 bg-red-50">
              <XCircle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800">
                {errorMessage}
              </AlertDescription>
            </Alert>
          )}
          
          {successMessage && (
            <Alert className="border-green-200 bg-green-50">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                {successMessage}
              </AlertDescription>
            </Alert>
          )}
          
          {/* Instructions */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h3 className="font-semibold text-blue-900 mb-2">What this does:</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Creates a <code className="bg-blue-100 px-1 rounded">user-content</code> storage bucket</li>
              <li>• Enables public access for profile images</li>
              <li>• Sets 5MB file size limit</li>
              <li>• Allows JPEG, PNG, GIF, and WebP images</li>
            </ul>
          </div>
          
          <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <h3 className="font-semibold text-gray-900 mb-2">Alternative Manual Setup:</h3>
            <p className="text-sm text-gray-600 mb-2">
              If the automatic setup doesn't work, you can create the bucket manually:
            </p>
            <ol className="text-sm text-gray-600 space-y-1">
              <li>1. Go to your <a href="https://supabase.com/dashboard/projects" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Supabase Dashboard</a></li>
              <li>2. Navigate to Storage → Buckets</li>
              <li>3. Click "Create a new bucket"</li>
              <li>4. Name: <code className="bg-gray-100 px-1 rounded">user-content</code></li>
              <li>5. Enable "Public bucket" ✅</li>
              <li>6. Set file size limit to 5MB</li>
            </ol>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}