import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Application, Lifecycle, ApplicationStatus, Interface, Criticality, ApplicationType } from '../types';
import { fetchApplications } from '../services/mockData';
import { Plus, Trash2 } from 'lucide-react';
import { Checkbox } from "@/components/ui/checkbox";

interface Relationship {
  appId: string;
  direction: 'outgoing' | 'incoming';
}

interface InterfaceForm {
  relationships: Relationship[];
  protocol: string;
  criticality: Criticality;
  description: string;
  data: string;
}

const AddApplication: React.FC = () => {
  const navigate = useNavigate();
  const [existingApps, setExistingApps] = useState<Application[]>([]);
  const [formData, setFormData] = useState<Partial<Application>>({
    id: crypto.randomUUID(),
    status: 'healthy',
    last_update: new Date().toISOString(),
    risk_score: 0,
    business_functions: [],
    data_processed: [],
    application_type: ApplicationType.OTHER
  });
  const [interfaces, setInterfaces] = useState<InterfaceForm[]>([]);

  useEffect(() => {
    // Load existing applications for interface selection
    const loadApplications = async () => {
      const apps = await fetchApplications();
      setExistingApps(apps);
    };
    loadApplications();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleArrayInput = (e: React.ChangeEvent<HTMLInputElement>, field: 'business_functions' | 'data_processed') => {
    const values = e.target.value.split(',').map(item => item.trim());
    setFormData(prev => ({ ...prev, [field]: values }));
  };

  const handleNumberInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: parseFloat(value) }));
  };

  const handleAddInterface = () => {
    setInterfaces(prev => [...prev, {
      relationships: [],
      protocol: '',
      criticality: Criticality.Medium,
      description: '',
      data: ''
    }]);
  };

  const handleAddRelationship = (interfaceIndex: number) => {
    setInterfaces(prev => prev.map((item, i) => {
      if (i === interfaceIndex) {
        return {
          ...item,
          relationships: [...item.relationships, { appId: '', direction: 'outgoing' }]
        };
      }
      return item;
    }));
  };

  const handleRemoveRelationship = (interfaceIndex: number, relationshipIndex: number) => {
    setInterfaces(prev => prev.map((item, i) => {
      if (i === interfaceIndex) {
        return {
          ...item,
          relationships: item.relationships.filter((_, j) => j !== relationshipIndex)
        };
      }
      return item;
    }));
  };

  const handleRelationshipChange = (
    interfaceIndex: number,
    relationshipIndex: number,
    field: keyof Relationship,
    value: string
  ) => {
    setInterfaces(prev => prev.map((item, i) => {
      if (i === interfaceIndex) {
        const newRelationships = [...item.relationships];
        newRelationships[relationshipIndex] = {
          ...newRelationships[relationshipIndex],
          [field]: value
        };
        return { ...item, relationships: newRelationships };
      }
      return item;
    }));
  };

  const handleInterfaceChange = (index: number, field: keyof Omit<InterfaceForm, 'relationships'>, value: string) => {
    setInterfaces(prev => prev.map((item, i) => {
      if (i === index) {
        return { ...item, [field]: value };
      }
      return item;
    }));
  };

  const handleRemoveInterface = (index: number) => {
    setInterfaces(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Ensure we have a valid ID
    const newAppId = formData.id || crypto.randomUUID();
    const newApp = { ...formData, id: newAppId };
    
    // Get existing applications and interfaces from localStorage
    const existingApps = JSON.parse(localStorage.getItem('applications') || '[]');
    const existingInterfaces = JSON.parse(localStorage.getItem('interfaces') || '[]');
    
    // Add new application
    const newApps = [...existingApps, newApp];
    
    // Create new interfaces with proper IDs, handling multiple relationships
    const newInterfaces = interfaces.flatMap((intf, index) => 
      intf.relationships.map((rel, relIndex) => ({
        id: `INT${newAppId}-${index}-${relIndex}`,
        source: rel.direction === 'outgoing' ? newAppId : rel.appId,
        target: rel.direction === 'outgoing' ? rel.appId : newAppId,
        protocol: intf.protocol,
        criticality: intf.criticality,
        description: intf.description,
        data: intf.data
      }))
    );
    
    // Save to localStorage
    localStorage.setItem('applications', JSON.stringify(newApps));
    localStorage.setItem('interfaces', JSON.stringify([...existingInterfaces, ...newInterfaces]));
    
    // Navigate to dashboard
    navigate('/dashboard');
  };

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>Add New Application</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name">Application Name</Label>
                <Input
                  id="name"
                  name="name"
                  required
                  onChange={handleInputChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="application_type">Application Type</Label>
                <Select
                  value={formData.application_type}
                  onValueChange={(value) => handleSelectChange('application_type', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select application type" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(ApplicationType).map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  required
                  onChange={handleInputChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="business_functions">Business Functions (comma-separated)</Label>
                <Input
                  id="business_functions"
                  name="business_functions"
                  placeholder="Function 1, Function 2, ..."
                  onChange={(e) => handleArrayInput(e, 'business_functions')}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="owner">Owner</Label>
                <Input
                  id="owner"
                  name="owner"
                  required
                  onChange={handleInputChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="owner_department">Owner Department</Label>
                <Input
                  id="owner_department"
                  name="owner_department"
                  required
                  onChange={handleInputChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contact_person">Contact Person</Label>
                <Input
                  id="contact_person"
                  name="contact_person"
                  required
                  onChange={handleInputChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contact_email">Contact Email</Label>
                <Input
                  id="contact_email"
                  name="contact_email"
                  type="email"
                  required
                  onChange={handleInputChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contact_phone">Contact Phone</Label>
                <Input
                  id="contact_phone"
                  name="contact_phone"
                  required
                  onChange={handleInputChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="stack">Technology Stack</Label>
                <Input
                  id="stack"
                  name="stack"
                  required
                  onChange={handleInputChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="databases">Databases</Label>
                <Input
                  id="databases"
                  name="databases"
                  required
                  onChange={handleInputChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="operating_system">Operating System</Label>
                <Input
                  id="operating_system"
                  name="operating_system"
                  required
                  onChange={handleInputChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="business_capability">Business Capability</Label>
                <Input
                  id="business_capability"
                  name="business_capability"
                  required
                  onChange={handleInputChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="lifecycle">Lifecycle</Label>
                <Select
                  onValueChange={(value) => handleSelectChange('lifecycle', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select lifecycle" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(Lifecycle).map((lifecycle) => (
                      <SelectItem key={lifecycle} value={lifecycle}>
                        {lifecycle}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="cost_annual">Annual Cost (€)</Label>
                <Input
                  id="cost_annual"
                  name="cost_annual"
                  type="number"
                  required
                  onChange={handleNumberInput}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="risk_score">Risk Score (0-100)</Label>
                <Input
                  id="risk_score"
                  name="risk_score"
                  type="number"
                  min="0"
                  max="100"
                  required
                  onChange={handleNumberInput}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="data_processed">Data Processed (comma-separated)</Label>
                <Input
                  id="data_processed"
                  name="data_processed"
                  placeholder="Data type 1, Data type 2, ..."
                  onChange={(e) => handleArrayInput(e, 'data_processed')}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="data_storage">Data Storage Location</Label>
                <Input
                  id="data_storage"
                  name="data_storage"
                  required
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Interfaces</h3>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleAddInterface}
                  className="flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Add Interface
                </Button>
              </div>

              {interfaces.map((intf, index) => (
                <Card key={index} className="p-4">
                  <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <h4 className="text-sm font-semibold">Relationships</h4>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => handleAddRelationship(index)}
                          className="flex items-center gap-2"
                        >
                          <Plus className="h-4 w-4" />
                          Add Relationship
                        </Button>
                      </div>
                      
                      {intf.relationships.map((rel, relIndex) => (
                        <div key={relIndex} className="grid grid-cols-1 md:grid-cols-2 gap-4 border p-4 rounded-lg">
                          <div className="space-y-2">
                            <Label>Application</Label>
                            <Select
                              value={rel.appId}
                              onValueChange={(value) => handleRelationshipChange(index, relIndex, 'appId', value)}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select application" />
                              </SelectTrigger>
                              <SelectContent>
                                {existingApps.map((app) => (
                                  <SelectItem key={app.id} value={app.id}>
                                    {app.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="space-y-2">
                            <Label>Direction</Label>
                            <Select
                              value={rel.direction}
                              onValueChange={(value) => handleRelationshipChange(index, relIndex, 'direction', value as 'outgoing' | 'incoming')}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select direction" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="outgoing">Sends Data To</SelectItem>
                                <SelectItem value="incoming">Receives Data From</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="md:col-span-2 flex justify-end">
                            <Button
                              type="button"
                              variant="destructive"
                              onClick={() => handleRemoveRelationship(index, relIndex)}
                              className="flex items-center gap-2"
                            >
                              <Trash2 className="h-4 w-4" />
                              Remove Relationship
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Protocol</Label>
                        <Input
                          value={intf.protocol}
                          onChange={(e) => handleInterfaceChange(index, 'protocol', e.target.value)}
                          placeholder="e.g., REST API, SOAP, etc."
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Criticality</Label>
                        <Select
                          value={intf.criticality}
                          onValueChange={(value) => handleInterfaceChange(index, 'criticality', value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select criticality" />
                          </SelectTrigger>
                          <SelectContent>
                            {Object.values(Criticality).map((crit) => (
                              <SelectItem key={crit} value={crit}>
                                {crit}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label>Data Exchanged</Label>
                        <Input
                          value={intf.data}
                          onChange={(e) => handleInterfaceChange(index, 'data', e.target.value)}
                          placeholder="e.g., Order Data, Customer Information"
                        />
                      </div>

                      <div className="space-y-2 md:col-span-2">
                        <Label>Description</Label>
                        <Textarea
                          value={intf.description}
                          onChange={(e) => handleInterfaceChange(index, 'description', e.target.value)}
                          placeholder="Describe the purpose of this interface"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <Button
                        type="button"
                        variant="destructive"
                        onClick={() => handleRemoveInterface(index)}
                        className="flex items-center gap-2"
                      >
                        <Trash2 className="h-4 w-4" />
                        Remove Interface
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/dashboard')}
              >
                Cancel
              </Button>
              <Button type="submit">
                Add Application
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddApplication; 