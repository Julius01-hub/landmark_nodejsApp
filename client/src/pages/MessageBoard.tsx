import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useLocation } from "wouter";
import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { ArrowLeft, Send, Trash2, Users } from "lucide-react";
import { toast } from "sonner";

export default function ContactForm() {
  const [, navigate] = useLocation();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [contact, setContact] = useState("");
  const [address, setAddress] = useState("");
  const [country, setCountry] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Query contacts
  const { data: contacts = [], isLoading, refetch } = trpc.contacts.list.useQuery();

  // Mutations
  const createContact = trpc.contacts.create.useMutation({
    onSuccess: () => {
      setName("");
      setEmail("");
      setContact("");
      setAddress("");
      setCountry("");
      refetch();
      toast.success("Contact saved successfully!");
    },
    onError: (error: any) => {
      toast.error(`Failed to save contact: ${error.message}`);
    },
  });

  const deleteContact = trpc.contacts.delete.useMutation({
    onSuccess: () => {
      refetch();
      toast.success("Contact deleted!");
    },
    onError: (error: any) => {
      toast.error(`Failed to delete contact: ${error.message}`);
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !contact.trim() || !address.trim() || !country.trim()) {
      toast.error("Please fill in all fields");
      return;
    }

    setIsSubmitting(true);
    try {
      await createContact.mutateAsync({
        name: name.trim(),
        email: email.trim(),
        contact: contact.trim(),
        address: address.trim(),
        country: country.trim(),
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-72 h-72 bg-yellow-400 rounded-full opacity-5 blur-3xl animate-pulse"></div>
        <div className="absolute top-1/3 right-20 w-96 h-96 bg-orange-500 rounded-full opacity-5 blur-3xl animate-pulse" style={{ animationDelay: "1s" }}></div>
      </div>

      {/* Navigation */}
      <nav className="relative z-10 border-b border-orange-400/30 bg-gradient-to-r from-orange-900/20 to-orange-800/10 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Button
            onClick={() => navigate("/")}
            variant="ghost"
            className="text-cream hover:text-yellow-400 gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Button>
          <h1 className="text-2xl font-bold text-cream tracking-wider">CONTACT FORM</h1>
          <div className="text-cream text-sm">Contacts: {contacts.length}</div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="relative z-5 max-w-6xl mx-auto px-4 py-12">
        {/* Contact Form */}
        <Card className="mb-12 p-8 bg-orange-900/40 border-orange-400/30">
          <h2 className="text-2xl font-bold text-cream mb-6 tracking-wider">SUBMIT YOUR DETAILS</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-cream font-bold mb-2 tracking-wider">Name</label>
                <Input
                  type="text"
                  placeholder="Enter your name..."
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="bg-orange-900/50 border-orange-400/50 text-cream placeholder:text-cream/50"
                  disabled={isSubmitting}
                />
              </div>
              <div>
                <label className="block text-cream font-bold mb-2 tracking-wider">Email</label>
                <Input
                  type="email"
                  placeholder="Enter your email..."
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-orange-900/50 border-orange-400/50 text-cream placeholder:text-cream/50"
                  disabled={isSubmitting}
                />
              </div>
              <div>
                <label className="block text-cream font-bold mb-2 tracking-wider">Contact</label>
                <Input
                  type="tel"
                  placeholder="Enter your phone number..."
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  className="bg-orange-900/50 border-orange-400/50 text-cream placeholder:text-cream/50"
                  disabled={isSubmitting}
                />
              </div>
              <div>
                <label className="block text-cream font-bold mb-2 tracking-wider">Country</label>
                <Input
                  type="text"
                  placeholder="Enter your country..."
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="bg-orange-900/50 border-orange-400/50 text-cream placeholder:text-cream/50"
                  disabled={isSubmitting}
                />
              </div>
            </div>
            <div>
              <label className="block text-cream font-bold mb-2 tracking-wider">Address</label>
              <Input
                type="text"
                placeholder="Enter your address..."
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="bg-orange-900/50 border-orange-400/50 text-cream placeholder:text-cream/50"
                disabled={isSubmitting}
              />
            </div>
            <Button
              type="submit"
              disabled={isSubmitting || createContact.isPending}
              className="bg-yellow-400 text-orange-900 hover:bg-yellow-300 font-bold tracking-wider gap-2 w-full"
            >
              <Send className="w-4 h-4" />
              {isSubmitting ? "Saving..." : "Submit"}
            </Button>
          </form>
        </Card>

        {/* Contacts Table */}
        <div>
          <div className="flex items-center gap-3 mb-6">
            <Users className="w-8 h-8 text-yellow-400" />
            <h2 className="text-2xl font-bold text-cream tracking-wider">
              SUBMITTED CONTACTS ({contacts.length})
            </h2>
          </div>

          {isLoading ? (
            <div className="text-center py-12">
              <p className="text-cream/70">Loading contacts...</p>
            </div>
          ) : contacts.length === 0 ? (
            <Card className="p-12 text-center bg-orange-900/40 border-orange-400/30">
              <p className="text-cream/70 mb-4">No contacts yet. Be the first to submit!</p>
            </Card>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-orange-900/40 border-b-2 border-yellow-400/50">
                    <th className="px-6 py-4 text-left text-cream font-bold tracking-wider">Name</th>
                    <th className="px-6 py-4 text-left text-cream font-bold tracking-wider">Email</th>
                    <th className="px-6 py-4 text-left text-cream font-bold tracking-wider">Contact</th>
                    <th className="px-6 py-4 text-left text-cream font-bold tracking-wider">Address</th>
                    <th className="px-6 py-4 text-left text-cream font-bold tracking-wider">Country</th>
                    <th className="px-6 py-4 text-left text-cream font-bold tracking-wider">Date</th>
                    <th className="px-6 py-4 text-center text-cream font-bold tracking-wider">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {contacts.map((contact: any) => (
                    <tr
                      key={contact.id}
                      className="border-b border-orange-400/20 hover:bg-orange-900/20 transition-colors"
                    >
                      <td className="px-6 py-4 text-cream">{contact.name}</td>
                      <td className="px-6 py-4 text-cream">{contact.email}</td>
                      <td className="px-6 py-4 text-cream">{contact.contact}</td>
                      <td className="px-6 py-4 text-cream">{contact.address}</td>
                      <td className="px-6 py-4 text-cream">{contact.country}</td>
                      <td className="px-6 py-4 text-cream/60 text-sm">
                        {new Date(contact.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <Button
                          onClick={() => deleteContact.mutate({ id: contact.id })}
                          variant="ghost"
                          size="sm"
                          className="text-red-400 hover:text-red-300"
                          disabled={deleteContact.isPending}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
