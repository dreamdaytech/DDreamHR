
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Users, Target, Eye, Calendar, Clock, FileText, UserCheck, UserX, Folder } from 'lucide-react';

const About = () => {
  const navigate = useNavigate();

  const modules = [
    {
      icon: Calendar,
      title: 'Leave Tracking',
      description: 'Comprehensive leave management with automated approval workflows'
    },
    {
      icon: Clock,
      title: 'Attendance Management',
      description: 'Real-time attendance tracking with flexible check-in options'
    },
    {
      icon: Clock,
      title: 'Time Tracking',
      description: 'Project-based time tracking with detailed reporting'
    },
    {
      icon: Users,
      title: 'Employee Directory',
      description: 'Centralized employee information and organizational charts'
    },
    {
      icon: UserCheck,
      title: 'Preboarding/Onboarding',
      description: 'Streamlined new hire processes and documentation'
    },
    {
      icon: UserX,
      title: 'Offboarding',
      description: 'Systematic employee exit procedures and asset recovery'
    }
  ];

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
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">About Us</h1>
          <div className="max-w-4xl mx-auto">
            <img 
              src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
              alt="Team collaboration"
              className="w-full h-64 object-cover rounded-lg shadow-lg mb-8"
            />
          </div>
        </div>

        {/* Our Story */}
        <section className="mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Story</h2>
              <p className="text-lg text-gray-600 leading-relaxed mb-6">
                DDreamHR was born from a simple vision: to create a forward-thinking HR platform that truly understands the needs of modern businesses. Founded by a team of HR professionals and technology experts, we recognized the gap between traditional HR systems and what today's dynamic workforce requires.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed">
                We built DDreamHR not just as software, but as a comprehensive solution that grows with your business, adapts to your processes, and empowers your team to focus on what matters most – your people.
              </p>
            </div>
            <div className="flex justify-center">
              <img 
                src="https://images.unsplash.com/photo-1559136555-9303baea8ebd?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
                alt="Modern workplace"
                className="rounded-lg shadow-lg max-w-full h-auto"
              />
            </div>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="mb-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="border-primary-200 bg-primary-50">
              <CardHeader>
                <CardTitle className="flex items-center text-primary-700">
                  <Target className="h-6 w-6 mr-2" />
                  Our Mission
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 text-lg">
                  To simplify, streamline, and modernize HR management for businesses of all sizes, enabling organizations to focus on their most valuable asset – their people.
                </p>
              </CardContent>
            </Card>

            <Card className="border-secondary-200 bg-secondary-50">
              <CardHeader>
                <CardTitle className="flex items-center text-secondary-700">
                  <Eye className="h-6 w-6 mr-2" />
                  Our Vision
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 text-lg">
                  To become the leading digital HR solution for workforce management in Africa and beyond, setting new standards for innovation and user experience.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* What We Offer */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">What We Offer</h2>
            <p className="text-xl text-gray-600">
              Comprehensive HR modules designed to handle every aspect of your workforce management
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {modules.map((module, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center mr-3">
                      <module.icon className="h-5 w-5 text-primary-700" />
                    </div>
                    {module.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{module.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Values */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Values</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-primary-700" />
              </div>
              <h3 className="text-xl font-bold mb-2">People First</h3>
              <p className="text-gray-600">We believe that great HR software puts people at the center of everything.</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="h-8 w-8 text-secondary-700" />
              </div>
              <h3 className="text-xl font-bold mb-2">Innovation</h3>
              <p className="text-gray-600">We continuously evolve our platform to meet the changing needs of modern workplaces.</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Eye className="h-8 w-8 text-green-700" />
              </div>
              <h3 className="text-xl font-bold mb-2">Transparency</h3>
              <p className="text-gray-600">We build trust through clear communication and honest relationships.</p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="text-center bg-gradient-to-r from-primary-700 to-secondary-700 rounded-lg p-12 text-white">
          <h2 className="text-3xl font-bold mb-4">Ready to Transform Your HR?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join hundreds of companies that trust DDreamHR for their workforce management needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              variant="outline" 
              className="text-white border-white hover:bg-white hover:text-primary-700"
              onClick={() => navigate('/demo')}
            >
              Request Demo
            </Button>
            <Button 
              size="lg" 
              className="bg-white text-primary-700 hover:bg-gray-100"
              onClick={() => navigate('/contact')}
            >
              Contact Us
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default About;
