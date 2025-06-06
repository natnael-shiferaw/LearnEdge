import { useEffect, useState, useContext } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { toast } from "@/hooks/use-toast"
import { captureAndFinalizePaymentService } from "@/services/paymentService"
import { AuthContext } from "@/context/auth-context"

export default function PaymentReturnPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { auth } = useContext(AuthContext)

  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Parse ?paymentId=…&PayerID=…
    const params = new URLSearchParams(location.search)
    const paymentId = params.get("paymentId")
    const payerId = params.get("PayerID")

    // Recall the orderId we stored earlier in sessionStorage
    const orderId = JSON.parse(
      sessionStorage.getItem("currentOrderId") || "null"
    )

    if (!paymentId || !payerId || !orderId) {
      setError("Missing PayPal parameters or order ID")
      setLoading(false)
      return
    }

    // Call backend to capture & finalize the order
    captureAndFinalizePaymentService( paymentId, payerId, orderId )
      .then((res) => {
        if (res.success) {
          toast({
            title: "Payment complete!",
            description: "Thank you for your purchase.",
            variant: "success",
            duration: 4000,
          })
          navigate(`/student/my-courses`)
        } else {
          setError(res.message || "Payment capture failed")
        }
      })
      .catch((err) => {
        console.error("Capture error:", err)
        setError("Network error during payment capture")
      })
      .finally(() => {
        setLoading(false)
      })
  }, [location.search, navigate, auth])

  if (loading) {
    return (
      <main className="container py-12">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle>Finalizing Payment</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Please wait while we confirm your purchase…</p>
          </CardContent>
        </Card>
      </main>
    )
  }

  if (error) {
    return (
      <main className="container py-12">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle className="text-destructive">Payment Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-red-600 mb-4">{error}</p>
            <Button onClick={() => navigate(-1)}>Go Back</Button>
          </CardContent>
        </Card>
      </main>
    )
  }

  // If everything succeeds, we’ll already have navigated away to /student/my-courses
  return null
}
