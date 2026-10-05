
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Play, Calendar, MessageSquare } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Demo = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    fullName: '',
    companyName: '',
    email: '',
    phone: '',
    preferredDate: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.companyName || !formData.email) {
      toast({
        title: 'Error',
        description: 'Please fill in all required fields.',
        variant: 'destructive'
      });
      return;
    }

    toast({
      title: 'Demo Request Submitted!',
      description: 'Thank you for your interest. Our team will contact you within 24 hours to schedule your demo.',
    });

    setFormData({
      fullName: '',
      companyName: '',
      email: '',
      phone: '',
      preferredDate: '',
      message: ''
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="w-full py-4 px-4 sm:px-6 lg:px-8 bg-white border-b">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" onClick={() => navigate('/')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
            <span className="font-bold text-2xl text-primary-700">DDreamHR</span>
          </div>
          <Button onClick={() => navigate('/login')}>Login</Button>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Request a Demo</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Want to see how DDreamHR works? Request a live demo or try out a guided walkthrough to explore the platform's features.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Demo Request Form */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Schedule Your Personalized Demo</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="fullName">Full Name *</Label>
                      <Input
                        id="fullName"
                        type="text"
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="companyName">Company Name *</Label>
                      <Input
                        id="companyName"
                        type="text"
                        value={formData.companyName}
                        onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="preferredDate">Preferred Demo Date/Time</Label>
                    <Input
                      id="preferredDate"
                      type="datetime-local"
                      value={formData.preferredDate}
                      onChange={(e) => setFormData({ ...formData, preferredDate: e.target.value })}
                    />
                  </div>

                  <div>
                    <Label htmlFor="message">Message (Optional)</Label>
                    <Textarea
                      id="message"
                      rows={4}
                      placeholder="Tell us about your specific needs or questions..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    />
                  </div>

                  <Button type="submit" className="w-full">
                    Request Live Demo
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Demo Options */}
          <div className="space-y-6">
            {/* Video Demo */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Play className="h-5 w-5 mr-2" />
                  Watch Demo Video
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="aspect-video bg-gray-200 rounded-lg mb-4 flex items-center justify-center">
                  <div className="text-center">
                    <Play className="h-16 w-16 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-500">Demo Video Coming Soon</p>
                  </div>
                </div>
                <p className="text-gray-600 mb-4">
                  Get a quick overview of DDreamHR's key features and see how it can transform your HR processes.
                </p>
                <Button variant="outline" className="w-full" disabled>
                  Watch Now (Coming Soon)
                </Button>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 gap-4">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/contact')}>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <MessageSquare className="h-8 w-8 text-primary-700 mr-4" />
                    <div>
                      <h3 className="font-semibold">Talk to Sales</h3>
                      <p className="text-gray-600 text-sm">Get answers to your questions</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/login')}>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <Calendar className="h-8 w-8 text-secondary-700 mr-4" />
                    <div>
                      <h3 className="font-semibold">Try Sample Dashboard</h3>
                      <p className="text-gray-600 text-sm">Explore with demo data</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Demo Features */}
            <Card>
              <CardHeader>
                <CardTitle>What You'll See in the Demo</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-primary-700 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span className="text-gray-700">Complete employee lifecycle management</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-primary-700 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span className="text-gray-700">Real-time attendance and time tracking</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-primary-700 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span className="text-gray-700">Automated leave management workflows</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-primary-700 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span className="text-gray-700">Comprehensive reporting and analytics</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-primary-700 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span className="text-gray-700">Mobile-responsive design</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-primary-700 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span className="text-gray-700">Integration capabilities</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Why Choose DreamDayHR */}
        <section className="mt-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose DDreamHR?</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="h-8 w-8 text-primary-700" />
              </div>
              <h3 className="text-xl font-bold mb-2">Easy Implementation</h3>
              <p className="text-gray-600">Get up and running in days, not months, with our intuitive setup process.</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="h-8 w-8 text-secondary-700" />
              </div>
              <h3 className="text-xl font-bold mb-2">24/7 Support</h3>
              <p className="text-gray-600">Our dedicated support team is always ready to help you succeed.</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Play className="h-8 w-8 text-green-700" />
              </div>
              <h3 className="text-xl font-bold mb-2">Scalable Solution</h3>
              <p className="text-gray-600">Grows with your business from startup to enterprise level.</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Demo;
