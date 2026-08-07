import { useAuth } from '@/lib/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useToast } from '@/components/ui/use-toast';

import { useState, useEffect } from 'react';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import StarsBackground from '@/components/younEEK/StarsBackground';

export default function Settings() {
  const { user, setEmail } = useAuth();
  const { toast } = useToast();

  const [emailInput, setEmailInput] = useState(user?.email || '');
  const [freqEnabled, setFreqEnabled] = useState(() => localStorage.getItem('hourlyFreqEnabled') === 'true');
  const [freqHz, setFreqHz] = useState(() => localStorage.getItem('hourlyFreqHz') || '432');
  const [freqDuration, setFreqDuration] = useState(() => localStorage.getItem('hourlyFreqDuration') || '5');

  useEffect(() => {
    localStorage.setItem('hourlyFreqEnabled', freqEnabled);
    localStorage.setItem('hourlyFreqHz', freqHz);
    localStorage.setItem('hourlyFreqDuration', freqDuration);
  }, [freqEnabled, freqHz, freqDuration]);

  const handleSaveEmail = () => {
    setEmail(emailInput.trim());
    toast({ title: emailInput.trim() ? 'Profile saved' : 'Profile cleared' });
  };

  const handleResetData = () => {
    localStorage.clear();
    window.dispatchEvent(new Event('clock-face-updated'));
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen pb-24 relative">
      <StarsBackground />
      <div className="pt-24 px-6 py-8 max-w-2xl mx-auto relative z-10">
        <div className="space-y-6">
          <div className="border-b border-border pb-6">
            <h2 className="text-xl font-semibold mb-4">Profile</h2>
            <p className="text-sm text-muted-foreground mb-2">Email (stored locally on this device)</p>
            <div className="flex gap-3 items-center">
              <Input
                type="email"
                placeholder="you@example.com"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                className="max-w-xs"
              />
              <Button variant="outline" onClick={handleSaveEmail}>Save</Button>
            </div>
          </div>

          <div className="border-b border-border pb-6">
            <h2 className="text-xl font-semibold mb-4">Clock Appearance</h2>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-2">Clock Face Background</p>
                <div className="flex gap-3 items-center">
                  <Button 
                    variant="outline" 
                    onClick={() => document.getElementById('clock-face-upload').click()}
                  >
                    Choose Image
                  </Button>
                  <Button 
                    variant="ghost" 
                    onClick={() => {
                      localStorage.removeItem('clockFaceUrl');
                      window.dispatchEvent(new Event('clock-face-updated'));
                      toast({ title: 'Clock face reset to default' });
                    }}
                  >
                    Reset
                  </Button>
                  <input 
                    id="clock-face-upload"
                    type="file" 
                    accept="image/*" 
                    className="hidden" 
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      const reader = new FileReader();
                      reader.onload = (event) => {
                        const img = new Image();
                        img.onload = () => {
                          const canvas = document.createElement('canvas');
                          const MAX_SIZE = 800;
                          let width = img.width;
                          let height = img.height;
                          
                          if (width > height && width > MAX_SIZE) {
                            height *= MAX_SIZE / width;
                            width = MAX_SIZE;
                          } else if (height > width && height > MAX_SIZE) {
                            width *= MAX_SIZE / height;
                            height = MAX_SIZE;
                          }
                          
                          canvas.width = width;
                          canvas.height = height;
                          const ctx = canvas.getContext('2d');
                          ctx.drawImage(img, 0, 0, width, height);
                          
                          const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
                          localStorage.setItem('clockFaceUrl', dataUrl);
                          window.dispatchEvent(new Event('clock-face-updated'));
                          toast({ title: 'Clock face updated!' });
                        };
                        img.src = event.target.result;
                      };
                      reader.readAsDataURL(file);
                    }} 
                  />
                </div>
              </div>
            </div>
          </div>



          <div className="border-b border-border pb-6">
            <h2 className="text-xl font-semibold mb-4">Hourly Frequency</h2>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-base">Play Frequency on the Hour</p>
                  <p className="text-sm text-muted-foreground">Plays a sound frequency every YouNeeK Hour.</p>
                </div>
                <Switch 
                  checked={freqEnabled}
                  onCheckedChange={setFreqEnabled}
                />
              </div>

              {freqEnabled && (
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Frequency</p>
                    <Select value={freqHz} onValueChange={setFreqHz}>
                      <SelectTrigger className="w-full sm:w-[200px]">
                        <SelectValue placeholder="Select frequency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="174">174 Hz (Healing)</SelectItem>
                        <SelectItem value="285">285 Hz (Tissue)</SelectItem>
                        <SelectItem value="396">396 Hz (Liberation)</SelectItem>
                        <SelectItem value="417">417 Hz (Undoing)</SelectItem>
                        <SelectItem value="432">432 Hz (Miracle)</SelectItem>
                        <SelectItem value="528">528 Hz (Transformation)</SelectItem>
                        <SelectItem value="639">639 Hz (Connection)</SelectItem>
                        <SelectItem value="741">741 Hz (Expression)</SelectItem>
                        <SelectItem value="852">852 Hz (Awakening)</SelectItem>
                        <SelectItem value="963">963 Hz (Crown)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Duration: {freqDuration} Seconds</p>
                    <Select value={freqDuration} onValueChange={setFreqDuration}>
                      <SelectTrigger className="w-full sm:w-[200px]">
                        <SelectValue placeholder="Select duration" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 Second</SelectItem>
                        <SelectItem value="3">3 Seconds</SelectItem>
                        <SelectItem value="5">5 Seconds</SelectItem>
                        <SelectItem value="10">10 Seconds</SelectItem>
                        <SelectItem value="30">30 Seconds</SelectItem>
                        <SelectItem value="60">60 Seconds</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="border-b border-border pb-6">
            <h2 className="text-xl font-semibold mb-4">Danger Zone</h2>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive">Reset App Data</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Reset App Data</AlertDialogTitle>
                  <AlertDialogDescription>
                    This clears all locally stored settings (profile email, custom clock face, and hourly frequency preferences) from this device. This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <div className="flex justify-end gap-3">
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleResetData} className="bg-destructive hover:bg-destructive/90">
                    Reset
                  </AlertDialogAction>
                </div>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </div>
    </div>
  );
}