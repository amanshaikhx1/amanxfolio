"use client"

import React, { useState } from "react"
import { motion } from "framer-motion"
import emailjs from "@emailjs/browser"
import {
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Github,
  Send,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

interface FormData {
  name: string
  email: string
  subject: string
  message: string
}

interface FormErrors {
  name?: string
  email?: string
  subject?: string
  message?: string
}

const ContactSection = () => {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    subject: "",
    message: "",
  })

  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<{
    type: "success" | "error"
    message: string
  } | null>(null)

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }))
    }
  }

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    if (!formData.name.trim()) newErrors.name = "Name is required"
    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email"
    }
    if (!formData.subject.trim()) newErrors.subject = "Subject is required"
    if (!formData.message.trim()) newErrors.message = "Message is required"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return

    setIsSubmitting(true)
    setSubmitStatus(null)

    try {
      const recipientEmail = "amanshaikhx01@gmail.com" // apna Gmail yahan
      const subject = encodeURIComponent(formData.subject)
      const body = encodeURIComponent(
        `Name: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}`
      )

      // mailto link for mobile Gmail app
      const mailtoLink = `mailto:${recipientEmail}?subject=${subject}&body=${body}`

      // open mailto link
      window.location.href = mailtoLink

      setSubmitStatus({
        type: "success",
        message:
          "Your Gmail app should open now. Please send your message from there.",
      })
    } catch (error) {
      setSubmitStatus({
        type: "error",
        message: "There was an error. Please try again.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }



  const socialLinks = [
    // {
    //   icon: <Facebook className="h-5 w-5" />,
    //   href: "#",
    //   label: "Facebook",
    //   color: "hover:bg-blue-600",
    // },
    // {
    //   icon: <Twitter className="h-5 w-5" />,
    //   href: "#",
    //   label: "Twitter",
    //   color: "hover:bg-blue-400",
    // },
    {
      icon: <Instagram className="h-5 w-5" />,
      href: "https://www.instagram.com/0x.amxo?igsh=MXhienF6bHE4cWJmcg==",
      label: "Instagram",
      color: "hover:bg-pink-600",
    },
    {
      icon: <Linkedin className="h-5 w-5" />,
      href: "https://www.linkedin.com/in/amanshaikhx01",
      label: "LinkedIn",
      color: "hover:bg-blue-700",
    },
    {
      icon: <Github className="h-5 w-5" />,
      href: "https://github.com/amanshaikhx1",
      label: "GitHub",
      color: "hover:bg-gray-800",
    },
  ]

  return (
    <section
      id="contact"
      className="min-h-[auto] md:min-h-screen flex items-center justify-center bg-[rgb(197,203,211,0.5)] dark:bg-gray-900 px-4 py-8 md:py-12"
    >
      <div className="container mx-auto px-5 relative z-10 max-w-5xl">
        {/* Heading */}
        <div className="text-center mb-12">
          <div className="mb-4">
            <span className="inline-block px-4 py-1 text-sm font-medium rounded-full bg-green-500/10 text-green-600 dark:text-green-500">
              Get In Touch
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent relative inline-block after:content-[''] after:block after:mt-2 after:w-24 after:h-1 after:bg-green-500 after:mx-auto">
            Contact Me
          </h2>
        </div>

        {/* Content */}
        <div className="flex flex-col lg:flex-row items-start justify-center gap-8">
          {/* Social icons */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5 }}
            className="flex flex-row justify-center items-center gap-4 mb-6 w-full lg:w-auto lg:mb-0 lg:flex-col lg:items-start"
          >
            {socialLinks.map((social, index) => (
              <a
                key={index}
                href={social.href}
                aria-label={social.label}
                className={`w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-700 dark:text-gray-300 hover:text-white transition-all duration-300 hover:-translate-y-1 ${social.color}`}
              >
                {social.icon}
              </a>
            ))}
          </motion.div>

          {/* Contact Form */}
          <motion.div
            className="w-full lg:max-w-3xl p-10 rounded-xl bg-white dark:bg-gray-800/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700/50"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Input
                    id="name"
                    name="name"
                    placeholder="Your Name"
                    value={formData.name}
                    onChange={handleChange}
                    className={errors.name ? "border-red-500" : ""}
                  />
                  {errors.name && (
                    <p className="text-red-500 text-sm">{errors.name}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Your Email"
                    value={formData.email}
                    onChange={handleChange}
                    className={errors.email ? "border-red-500" : ""}
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm">{errors.email}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Input
                  id="subject"
                  name="subject"
                  placeholder="Subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className={errors.subject ? "border-red-500" : ""}
                />
                {errors.subject && (
                  <p className="text-red-500 text-sm">{errors.subject}</p>
                )}
              </div>

              <div className="space-y-2">
                <Textarea
                  id="message"
                  name="message"
                  placeholder="Your Message"
                  rows={5}
                  value={formData.message}
                  onChange={handleChange}
                  className={errors.message ? "border-red-500" : ""}
                />
                {errors.message && (
                  <p className="text-red-500 text-sm">{errors.message}</p>
                )}
              </div>

              <div>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-green-500 to-green-400 hover:from-green-600 hover:to-green-500 text-white rounded-full py-3 shadow-lg shadow-green-500/30 hover:shadow-green-500/50 hover:-translate-y-1 transition-all group"
                >
                  <span className="mr-2">
                    {isSubmitting ? "Sending..." : "Send Message"}
                  </span>
                  <Send className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>

              {submitStatus && (
                <div
                  className={`p-3 rounded-lg text-center ${submitStatus.type === "success"
                    ? "bg-green-500/20 text-green-500"
                    : "bg-red-500/20 text-red-500"
                    }`}
                >
                  {submitStatus.message}
                </div>
              )}
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default ContactSection